import {Component, HyperComponent, property, wire} from "@hypertype/ui";
import {
    combineLatest,
    distinctUntilChanged,
    filter,
    Fn,
    Injectable,
    map,
    Observable,
    shareReplay,
    switchMap,
    tap
} from "@hypertype/core";
import {Context, ContextTree, Path} from "@domain";
import {TextContentComponent} from "./text-content.component";


customElements.define('context-content', TextContentComponent as any);

@Injectable(true)
@Component({
    name: 'app-context',
    template: (html, state: IState, events) => {
        if (state.path.indexOf(state.context.Id) < state.path.length - 1)
            return html`[[circular]]`;
        if (!state.context)
            return html``;
        const context = state.context;
        const isEmpty = state.state.includes('empty');
        const isCollapsed = state.state.includes('collapsed');
        return html`
            <div class="${`context-inner ${state.state.join(' ')}`}">
                <div class="body">
                    <span class="arrow"></span>
                    <ctx-text-content context=${state.context} 
                                      active=${state.isSelected}
                                      path=${state.path}
                                      ></ctx-text-content>
                </div>
                <div class="children">
                ${isCollapsed ? '' : context.Children.map(child =>
            wire(wire, `context${child.getKey([...state.path, child.Id])}`)`
                        <app-context path="${[...state.path, child.Id]}"></app-context>
                    `
        )}
                </div>
            </div>
        `
    },
    style: require('./context.style.less')
})
export class ContextComponent extends HyperComponent<IState> {

    constructor(private tree: ContextTree) {
        super();
    }


    @property()
    public path$: Observable<Path>;

    private Path$ = this.path$.pipe(
        distinctUntilChanged(arrayEqual)
    )

    private id$ = this.path$.pipe(
        map(ids => ids[ids.length - 1]),
        distinctUntilChanged(),
        shareReplay(1)
    );

    private context$: Observable<Context> = this.id$.pipe(
        map(id => this.tree.Items.get(id)),
        distinctUntilChanged(),
        switchMap(context => context.State$),
        filter(Fn.Ib),
        shareReplay(1)
    );

    private IsSelected$ = combineLatest([
        this.tree.CurrentPath$,
        this.path$,
    ]).pipe(
        map(([cursorPath, currentPath]) => arrayEqual(cursorPath, currentPath)),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public State$ = combineLatest([
        this.context$, this.path$, this.IsSelected$,
    ]).pipe(
        map(([context, path, isSelected]) => ({
            context, isSelected, path,
            state: [
                isSelected ? 'selected' : '',
                (context.Children.length == 0) ? 'empty' : '',
                (context.Collapsed) ? 'collapsed' : ''
            ] as any[],
        })),
        filter(Fn.Ib)
    );


}

interface IState {
    state: ('empty' | 'collapsed')[];
    context: Context;
    path: Path;
    isSelected: boolean;
}

export function arrayEqual(arr1: any[], arr2: any[]) {
    return arr1 && arr2 && arr1.length === arr2.length
        && arr1.every((x, i) => x === arr2[i])
}