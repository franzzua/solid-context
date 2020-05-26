import {IEventHandler, wire} from "@hypertype/ui";

export const Template = (html, state: IState, events: IEventHandler<IEvents>) => html`
    <button onclick="${events.draw(e => e)}">Draw</button>
    <canvas></canvas>
`;

export interface IState {

}

export interface IEvents {
    draw();
}
    