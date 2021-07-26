import {Component, HyperComponent, wire} from "@hypertype/ui";
import {Injectable} from "@hypertype/core";
import {Router, RouterState} from "@hypertype/app";
import {IAppAuthService, IApplication} from "@app";
import {KeyboardHandler} from "../../ui/handlers/keyboard.handler";
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
    },

    trip(state: RouterState) {
        return wire(wire, 'tree')`
            <trip-page></trip-page>
        `;
    }
};

@Injectable(true)
@Component({
    name: 'app-root',
    template: (html, state: RouterState, events) => html`
        ${pages[state.name](state)}
    `,
    style: require('./root.style.less')
})
export class RootComponent extends HyperComponent<RouterState> {

    constructor(private router: Router,
                /*private application: IApplication,
                private dataService: IDataAdapter<IDataActions, RootDbo>,
                private keyboardHanlder: KeyboardHandler,
                private appAuthService: IAppAuthService*/) {
        super();
        // this.keyboardHanlder.Actions$.subscribe();
        // appAuthService.GetSession().then(s => {
        //     if (s) {
        //         this.application.Start();
        //     }
        // })
    }

    public State$ = this.router.State$;

    public Events = {
        goto: (path) => {
            this.router.Actions.navigate(path);
        },
        login: async () => {
            // await this.application.Start();
        },
        clear: async () => {
            // await this.dataService.Actions.Clear();
        }
    }
}