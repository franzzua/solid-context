import {Injectable, Observable, utc} from "@hypertype/core";
import {ContextCollection} from "../data/contextDocument";
import {ContextDbo, Id, IDataActions} from "@domain/contracts";
import {ContextEntity} from "../data/contextEntity";
import {ISession, useFetch, useSession} from "solidocity";

useFetch(fetch);

@Injectable()
export class SolidDataService implements IDataActions {
    private collection: ContextCollection;
    private saveDocSubscription$: ReturnType<typeof Observable.prototype.subscribe>;

    constructor() {
    }

    public async Clear() {
        await this.collection.Remove();
        await this.Load();
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


    public async Init(session: ISession) {
        await useSession(session);
        await this.saveDocSubscription$?.unsubscribe();
        this.collection = new ContextCollection(session);
        await this.collection.Init();
        if (this.collection.ContextDocuments.Documents.length == 0) {
            await this.collection.ContextDocuments.Create('root.ttl');
        }
        // for (let document of this.collection.ContextDocuments.Documents) {
        //     document.on('update', async x => {
        //         console.log('data update');
        //         const dbo = await this.Load();
        //         this.State$.subscriptions.forEach(f => f(dbo));
        //     });
        // }
        const dbo = await this.Load();
        this.State$.subscriptions.forEach(f => f(dbo));
    }

    public State$ = {
        subscriptions: [],
        subscribe(cb: Function) {
            this.subscriptions.push(cb);
            return () => {
                this.subscriptions.splice(this.subscriptions.indexOf(cb), 1);
            }
        }
    }


    private getDocument() {
        return this.collection.ContextDocuments.Documents[0];
    }

    public async Create(context: ContextDbo): Promise<ContextDbo> {
        const newItem = this.getDocument().Contexts.Add();
        newItem.fromDTO(context);
        this.UpdateEntities(newItem);
        return newItem.toDTO();
    }

    public async Delete(ids: Id[]): Promise<any> {
        for (const id of ids) {
            const entity = this.getDocument().Contexts.get(id);
            entity.Remove();
            this.UpdateEntities(entity);
        }
    }

    public async AddChild(childId, parentId, index): Promise<void> {
        if (!this.getDocument().Contexts.get(childId)) {
            const newItem = this.getDocument().Contexts.Add(childId);
            this.UpdateEntities(newItem);
        }
        const entity = this.getDocument().Contexts.get(parentId);
        entity.Children.Insert(childId, index);
        this.UpdateEntities(entity);
    }

    public async RemoveChild(parentId: Id, index: number): Promise<void> {
        const parent = this.getDocument().Contexts.get(parentId);
        const childId = parent.Children.Items[index];
        parent.Children.Remove(index);
        const child = this.getDocument().Contexts.get(childId);
        child.Remove();
        this.UpdateEntities(parent);
    }

    public async ChangePosition(id: Id, from: { id: Id, index: number }, to: { id: Id, index: number }): Promise<void> {
        if (from.id == to.id) {
            const parent = this.getDocument().Contexts.get(from.id);
            parent.Children.Reorder(from.index, to.index);
            this.UpdateEntities(parent);
        } else {
            const oldParent = this.getDocument().Contexts.get(from.id);
            const newParent = this.getDocument().Contexts.get(to.id);
            oldParent.Children.Remove(from.index);
            newParent.Children.Insert(id, to.index);
            this.UpdateEntities(oldParent);
            this.UpdateEntities(newParent);
        }
    }

    public async ChangeContent(id: Id, content: any): Promise<void> {
        const docID = id.split('#')[0];
        const entity = this.getDocument().Contexts.get(id);
        entity.Content = content;
        this.UpdateEntities(entity);
    }

    public NewId(): string {
        const id = this.getDocument().Contexts.Items.length + 1;
        return `${this.getDocument().URI}#${id}`;
    }


    private isSaving = false;
    private entitiesToSave = [];

    private UpdateEntities(...entities: ContextEntity[]) {
        this.entitiesToSave.push(...entities);
        if (this.isSaving) {
            return;
        }
        const toSave = [...this.entitiesToSave];
        this.entitiesToSave = [];
        if (toSave.length == 0)
            return;
        this.isSaving = true;
        this.SaveEntities(toSave).then(() => {
            this.isSaving = false;
            this.UpdateEntities()
        });
    }

    private async SaveEntities(entities: ContextEntity[]) {
        console.log('start save', ...entities.map(x => x.Content));
        entities.forEach(e => e.Save());
        try {
            for (const d of entities.map(e => e.Document).distinct()) {
                await d.Save();
            }
        } catch (e) {
            console.error('save error');
        }
        console.log('saved');
    }

}

