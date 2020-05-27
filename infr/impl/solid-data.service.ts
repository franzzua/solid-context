import {bufferTime, catchError, filter, Injectable, mergeMap, never,Observable, Subject, utc} from "@hypertype/core";
import {ContextDocument} from "../data/contextDocument";
import {ContextDbo, Id, IDataAdapter, RootDbo} from "@domain";
import {ContextEntity} from "../data/contextEntity";
import {IAppAuthService} from "@app";

@Injectable()
export class SolidDataService extends IDataAdapter {
    private document: ContextDocument;
    private saveDocSubscription$: ReturnType<typeof Observable.prototype.subscribe>;

    constructor(private appAuthService: IAppAuthService) {
        super();
    }

    public async Clear() {
        this.document.Contexts.Items.forEach(x => x.Remove());
        await this.document.Save();
    }

    public async Load() {
        await this.saveDocSubscription$?.unsubscribe();
        const session = await this.appAuthService.GetSession();
        this.document = new ContextDocument(`${new URL(session.webId).origin}/context/index.ttl`);
        await this.document.Init();
        if (this.document.Contexts.Items.length == 0) {
            const entity = await this.document.Contexts.Add('root');
            entity.Content = 'Start...';
            entity.Time = utc().toJSDate();
            entity.Save();
            await this.document.Save();
        }
        const dtos = this.document.Contexts.Items.map(c => c.toDTO());
        const rootDTO: RootDbo = {
            Contexts: dtos,
            Relations: [],
            Users: [],
            Root: `${this.document.URI}#root`,
            UserState: {
                ContextsState: {}
            }
        }
        this.saveDocSubscription$ = this.saveDoc$.subscribe()
        return rootDTO;
    }

    public async Create(context: ContextDbo): Promise<void> {
        const newItem = this.document.Contexts.Add(context.Id);
        newItem.fromDTO(context);
        this.UpdateEntities.next(newItem);
    }

    public async Delete(ids: Id[]): Promise<any> {
        for (const id of ids) {
            const entity = this.document.Contexts.get(id);
            entity.Remove();
            this.UpdateEntities.next(entity);
        }
    }

    public async AddChild(childId, parentId, index): Promise<void> {
        if (this.document.Contexts.get(childId)) {
            const newItem = this.document.Contexts.Add(childId);
            this.UpdateEntities.next(newItem);
        }
        const entity = this.document.Contexts.get(parentId);
        entity.Children.Insert(childId, index);
        this.UpdateEntities.next(entity);
    }

    public async RemoveChild(parentId: Id, index: number): Promise<void> {
        const parent = this.document.Contexts.get(parentId);
        const childId = parent.Children.Items[index];
        parent.Children.Remove(index);
        const child = this.document.Contexts.get(childId);
        child.Remove();
        this.UpdateEntities.next(parent);
    }

    public async ChangePosition(id: Id, from: { id: Id, index: number }, to: { id: Id, index: number }): Promise<void> {
        if (from.id == to.id) {
            const parent = this.document.Contexts.get(from.id);
            parent.Children.Reorder(from.index, to.index);
            this.UpdateEntities.next(parent);
        }else{
            const oldParent = this.document.Contexts.get(from.id);
            const newParent = this.document.Contexts.get(to.id);
            oldParent.Children.Remove(from.index);
            newParent.Children.Insert(id, to.index);
            this.UpdateEntities.next(oldParent);
            this.UpdateEntities.next(newParent);
        }
    }

    public async ChangeContent(id: Id, content: any): Promise<void> {
        const docID = id.split('#')[0];
        const entity = this.document.Contexts.get(id);
        entity.Content = content;
        this.UpdateEntities.next(entity);
    }

    public NewId(): string {
        const id = this.document.Contexts.Items.length + 1;
        return `${this.document.URI}#${id}`;
    }

    private UpdateEntities = new Subject<ContextEntity>();

    private saveDoc$  = this.UpdateEntities.asObservable().pipe(
        bufferTime(500),
        filter(arr => arr.length > 0),
        mergeMap(async entities => {
            entities.distinct().forEach(e => e.Save());
            for (const d of entities.map(e => e.Document).distinct()) {
                await d.Save();
            }
            console.log('save');
        }),
        catchError(e => {
            console.error(e);
            return never()
        })
    );

}

