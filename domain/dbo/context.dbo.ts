import {Id} from "../model/base/id";
import {ILeaf} from "../model/base/tree";

export interface RootDbo {
    Root: Id;
    Contexts: ContextDbo[];
    Users: UserDbo[];
    Relations: RelationDbo[];
    UserState: {
        ContextsState: IMap<Id, ContextState>
    }
}

export interface ContextState {
    Collapsed?: boolean;
}

export interface UserDbo {
    Id: Id;
    Name: string;
    Email: string;
}

export interface RelationDbo {
    UserId: Id;
    ContextId: Id;
    Type: RelationType;
}

export enum RelationType {
    View = 'view',
    Notify = 'notify',
    Write = 'write',
    Responsibility = 'responsibility',
    Owner = 'owner',
}

export type ISODate = string;

export interface ContextDbo extends ILeaf<Id>{
    Content: TextContent[];
    Time: ISODate;
}

export interface TextContent {
    Text: string;
}

export interface AudioContent {

}

export interface ContextLink {

}

export interface UserLink {

}

export interface Document {

}

export interface Email {

}

export type Content = TextContent
    | AudioContent
    | ContextLink
    | UserLink
    | Document
    | Email;

export type IMap<TKey, TValue> = {
    // @ts-ignore
    [key: TKey]: TValue;
}