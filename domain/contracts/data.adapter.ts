import {ContextDbo, RootDbo} from "../dbo/context.dbo";
import {Id} from "../model/base/id";
import {Observable} from "@hypertype/core";



export abstract class IDataActions {

    public abstract async Load(): Promise<RootDbo>;

    public abstract async Init(session);

    public abstract async Create(context: ContextDbo): Promise<ContextDbo>;

    public abstract async AddChild(childId: Id, parentId: Id, index: number): Promise<void>;

    public abstract async RemoveChild(parentId: Id, index: number): Promise<void>;

    public abstract async ChangePosition(id: Id, from: {id: Id, index: number}, to: {id: Id, index: number}): Promise<void>;

    public abstract async ChangeContent(id: Id, content: any): Promise<void>;

    // public abstract NewId(): Id;

    public abstract async Clear();

    public abstract async Delete(ids: Id[]);

}