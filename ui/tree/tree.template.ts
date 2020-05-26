import {ContextTree} from "@domain";

export const Template = (html, state: IState) => html`
    <app-context path="${[state.tree.Root.Id]}"></app-context>
`;

export interface IState {
    tree: ContextTree;
}