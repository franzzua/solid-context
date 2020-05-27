import {ContentService, Context, ContextTree, CursorService, Path} from "@domain";
import {
    distinctUntilChanged,
    switchMap,
    withLatestFrom,
    of,
    filter,
    map,
    Injectable,
    mapTo,
    merge,
    Observable,
    tap,
} from "@hypertype/core";
import {Component, HyperComponent, IEventHandler, property} from "@hypertype/ui";

@Injectable(true)
@Component({
    name: 'ctx-text-content',
    template: (html, state, events: IEventHandler<IEvents>) => html`
        <div contenteditable class="editor"
             oninput=${events.input(x => x.target.innerText)}
             onfocus=${events.focus(x => void 0)}>
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

    private lastTextEdited;

    public Events: IEvents = {
        input: async text => {
            this.lastTextEdited = text;
            await this.content.SetContent(this.context, text);
        },
        focus: async () => {
            this.cursor.SetPath(this.path);
        }
    }

    public State$ = of(null);

    public Actions$ = merge(
        this.context$.pipe(
            switchMap(c => c.State$),
            map(context => context?.toString()),
            filter(x => x!=this.lastTextEdited),
            distinctUntilChanged(),
            withLatestFrom(this.select<HTMLElement>('[contenteditable]')),
            tap(([text,element]) => {
                element.innerHTML = text;
            })
        ),
        this.active$.pipe(
            distinctUntilChanged(),
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