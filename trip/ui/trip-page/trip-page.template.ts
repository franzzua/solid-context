import {IEventHandler, wire} from "@hypertype/ui";
import {ContextTree} from "@domain";

export const Template = (html, state, events: IEventHandler<IEvents>) => html`
    <app-context path=${[state.Root.Id]} tree=${state}/>
`;

export type IState = ContextTree;

export interface IEvents {

}
