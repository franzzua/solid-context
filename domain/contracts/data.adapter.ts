import {ContextDbo, RootDbo} from "../dbo/context.dbo";
import {Id} from "../model/base/id";
import {Context} from "../model/context";

export abstract class IDataAdapter {

    public abstract async Load(): Promise<RootDbo>;

    public abstract async Create(context: ContextDbo): Promise<void>;

    public abstract async Add(childId: Id, parentId: Id, index: number): Promise<void>;

    public abstract async Remove(parentId: Id, index: number): Promise<void>;

    public abstract async ChangePosition(id: Id, from: {id: Id, index: number}, to: {id: Id, index: number}): Promise<void>;

    public abstract async ChangeContent(id: Id, content: any): Promise<void>;

    public abstract NewId(): Id;

    public abstract async Clear();
}