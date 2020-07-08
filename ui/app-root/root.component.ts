import {Component, HyperComponent, wire} from "@hypertype/ui";
import {Injectable} from "@hypertype/core";
import {Router, RouterState} from "@hypertype/app";
import {IAppAuthService, IApplication} from "@app";
import {KeyboardHandler} from "../handlers/keyboard.handler";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";
import {IDataActions, RootDbo} from "@domain";

const pages = {
    whiteboard(state: RouterState) {
        return wire(wire, 'whiteboard')`
            <ctx-whiteboard></ctx-whiteboard>
        `
    },

    tree(state: RouterState) {
        return wire(wire, 'tree')`
            <ctx-tree></ctx-tree>
        `;
    }
};

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, state: RouterState, events) => html`
        <button onclick=${events.login(x => x)}>login</button>
        <button onclick=${events.clear(x => x)}>clear</button>
        <div>
            <button onclick="${events.goto(e => 'tree')}">tree</button>
            <button onclick="${events.goto(e => 'whiteboard')}">whiteboard</button>
        </div>
        ${pages[state.name](state)}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<RouterState> {

    constructor(private router: Router,
                private application: IApplication,
                private dataService: IDataAdapter<IDataActions, RootDbo>,
                private keyboardHanlder: KeyboardHandler,
                private appAuthService: IAppAuthService) {
        super();
        this.keyboardHanlder.Actions$.subscribe();
        appAuthService.GetSession().then(s => {
            if (s) {
                this.application.Start();
            }
        })
    }

    public State$ = this.router.State$;

    public Events = {
        goto: (path) => {
            this.router.Actions.navigate(path);
        },
        login: async () => {
            await this.application.Start();
        },
        clear: async () => {
            await this.dataService.Actions.Clear();
        }
    }
}