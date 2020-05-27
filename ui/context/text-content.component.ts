import {ContentService, Context, ContextTree, CursorService, Path} from "@domain";
import {
    withLatestFrom,
    filter,
    fromEvent,
    map,
    Injectable,
    mapTo,
    merge,
    Observable,
    Subject,
    tap,
    combineLatest,
    distinctUntilChanged, shareReplay
} from "@hypertype/core";
import {Component, HyperComponent, IEventHandler, property} from "@hypertype/ui";

@Injectable(true)
@Component({
    name: 'ctx-text-content',
    template: (html, state, events: IEventHandler<IEvents>) => html`
        <div contenteditable class="editor"
             oninput=${events.input(x => x.target.innerText)}
             onfocus=${events.focus(x => void 0)}>
            ${state}
        </div>
    `,
    style: `ctx-text-content { cursor: text; flex: 1; }`
})
export class TextContentComponent extends HyperComponent<string, IEvents> {

    constructor(private cursor: CursorService,
                private content: ContentService) {
        super();
    }

    @property()
    private context$: Observable<Context>;
    private context: Context;

    @property()
    private path$: Observable<Path>;
    private path: Path;

    @property()
    private active$: Observable<boolean>;


    public Events: IEvents = {
        input: async text => {
            await this.content.SetContent(this.context, text);
        },
        focus: async () => {
            this.cursor.SetPath(this.path);
        }
    }

    public State$ = this.context$.pipe(
        map(context => context?.toString())
    )

    public Actions$ = merge(
        this.active$.pipe(
            filter(x => x == true),
            withLatestFrom(this.select<HTMLElement>('[contenteditable]')),
            tap(([_, element]) => {
                element.focus()
            })
        )
    ).pipe(mapTo(null))
}

export interface IEvents {
    input(text);
    focus();
}