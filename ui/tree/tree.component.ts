import {Component, HyperComponent} from "@hypertype/ui";
import {IState, Template} from "./tree.template";
import {ContextTree, CursorService, HierarchyService} from "@domain";
import {Router} from "@hypertype/app";
import {tap, Injectable, map, Observable} from "@hypertype/core";

@Injectable(true)
@Component({
    name: 'ctx-tree',
    template: Template,
    style: require('./tree.style.less')
})
export class TreeComponent extends HyperComponent<IState> {

    constructor(private tree: ContextTree,
                private hierarchy: HierarchyService,
                private cursor: CursorService,
                private router: Router) {
        super();
    }

    public State$: Observable<IState> = this.tree.State$.pipe(
        map((tree) => ({tree})),
        tap(console.log),
    );


}
    