import {IEventHandler, wire} from "@hypertype/ui";
import {ContextTree} from "@domain";
import * as Azure from "../../services";

export const Template = (html, [tree, suggestions, entities], events: IEventHandler<IEvents>) => html`
    <app-context path=${[tree.Root.Id]} tree=${tree}/>
`;

export type IState = [ContextTree, Azure.Suggestion[], Azure.Entity]

export interface IEvents {
    search(text);
}
