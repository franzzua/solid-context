import {
    bufferTime,
    catchError,
    filter,
    Injectable,
    map,
    mergeMap,
    never,
    Observable,
    ReplaySubject,
    Subject,
    utc
} from "@hypertype/core";
import {ContextCollection} from "../data/contextDocument";
import {ContextDbo, Id, IDataAdapter, RootDbo} from "@domain";
import {ContextEntity} from "../data/contextEntity";
import {IAppAuthService} from "@app";

@Injectable()
export class SolidDataService extends IDataAdapter {
    private collection: ContextCollection;
    private saveDocSubscription$: ReturnType<typeof Observable.prototype.subscribe>;

    constructor(private appAuthService: IAppAuthService) {
        super();
    }

    public async Clear() {
        await this.collection.Remove();
    }

    public async Load() {
        const contextDBOs = []
        for (let document of this.collection.ContextDocuments.Documents) {
            await document.Reload();
            if (document.Contexts.Items.length == 0) {
                const entity = await document.Contexts.Add('root');
                entity.Content = 'Start...';
                entity.Time = utc().toJSDate();
                entity.Save();
                await document.Save();
            }
            const dtos = document.Contexts.Items.map(c => c.toDTO());
            contextDBOs.push(...dtos);
        }
        return {
            Contexts: contextDBOs,
            Relations: [],
            Users: [],
            Root: `${this.collection.folderURI}/root.ttl#root`,
            UserState: {
                ContextsState: {}
            }
        }
    }

    public async Init() {
        await this.saveDocSubscription$?.unsubscribe();
        const session = await this.appAuthService.GetSession();
        this.collection = new ContextCollection(session);
        await this.collection.Init();
        if (this.collection.ContextDocuments.Documents.length == 0) {
            await this.collection.ContextDocuments.Create('root.ttl');
        }
        for (let document of this.collection.ContextDocuments.Documents) {
            document.on('update', x => {
                console.log('data update');
                this.Changes$.next(x)
            });
        }
        this.saveDocSubscription$ = this.saveDoc$.subscribe()
    }

    public Changes$ = new ReplaySubject<RootDbo>();

    private getDocument() {
        return this.collection.ContextDocuments.Documents[0];
    }

    public async Create(context: ContextDbo): Promise<ContextDbo> {
        await this.savePromise$;
        const newItem = this.getDocument().Contexts.Add();
        newItem.fromDTO(context);
        this.UpdateEntities.next(newItem);
        return newItem.toDTO();
    }

    public async Delete(ids: Id[]): Promise<any> {
        await this.savePromise$;
        for (const id of ids) {
            const entity = this.getDocument().Contexts.get(id);
            entity.Remove();
            this.UpdateEntities.next(entity);
        }
    }

    public async AddChild(childId, parentId, index): Promise<void> {
        if (!this.getDocument().Contexts.get(childId)) {
            const newItem = this.getDocument().Contexts.Add(childId);
            this.UpdateEntities.next(newItem);
        }
        const entity = this.getDocument().Contexts.get(parentId);
        entity.Children.Insert(childId, index);
        this.UpdateEntities.next(entity);
    }

    public async RemoveChild(parentId: Id, index: number): Promise<void> {
        await this.savePromise$;
        const parent = this.getDocument().Contexts.get(parentId);
        const childId = parent.Children.Items[index];
        parent.Children.Remove(index);
        const child = this.getDocument().Contexts.get(childId);
        child.Remove();
        this.UpdateEntities.next(parent);
    }

    public async ChangePosition(id: Id, from: { id: Id, index: number }, to: { id: Id, index: number }): Promise<void> {
        await this.savePromise$;
        if (from.id == to.id) {
            const parent = this.getDocument().Contexts.get(from.id);
            parent.Children.Reorder(from.index, to.index);
            this.UpdateEntities.next(parent);
        } else {
            const oldParent = this.getDocument().Contexts.get(from.id);
            const newParent = this.getDocument().Contexts.get(to.id);
            oldParent.Children.Remove(from.index);
            newParent.Children.Insert(id, to.index);
            this.UpdateEntities.next(oldParent);
            this.UpdateEntities.next(newParent);
        }
    }

    public async ChangeContent(id: Id, content: any): Promise<void> {
        await this.savePromise$;
        const docID = id.split('#')[0];
        const entity = this.getDocument().Contexts.get(id);
        entity.Content = content;
        this.UpdateEntities.next(entity);
    }

    public NewId(): string {
        const id = this.getDocument().Contexts.Items.length + 1;
        return `${this.getDocument().URI}#${id}`;
    }

    private UpdateEntities = new Subject<ContextEntity>();


    private savePromise$ = Promise.resolve();
    private saveDoc$ = this.UpdateEntities.asObservable().pipe(
        bufferTime(500),
        filter(arr => arr.length > 0),
        map(entities => entities.distinct()),
        mergeMap(async entities => {
            await this.savePromise$;
            console.log('start save', ...entities.map(x => x.Content));
            await (this.savePromise$ = new Promise<void>(async resolve => {
                entities.forEach(e => e.Save());
                for (const d of entities.map(e => e.Document).distinct()) {
                    await d.Save();
                }
                resolve();
            }));
            console.log('save', ...entities.map(x => x.Content));
        }),
        catchError(e => {
            console.error(e);
            return never()
        })
    );

}

