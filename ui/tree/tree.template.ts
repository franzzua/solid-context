import {ContextTree} from "@domain";
import {wire} from "@hypertype/ui";

export const Template = (html, state: IState) => html`
    ${wire()`
        <app-context path="${[state.tree.Root.Id]}"></app-context>
    `}
`;

export interface IState {
    tree: ContextTree;
}