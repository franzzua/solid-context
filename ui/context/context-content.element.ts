import {Context, Path} from "@domain";
import {fromEvent, merge, Subject, takeUntil, tap} from "@hypertype/core";

export class ContextContentElement extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.contentEditable = 'true';
        this.className = 'editor';
        this.Subscribe();
    }
    disconnectedCallback() {
        this.disconnect$.next();
        this.disconnect$.complete();
    }
    private disconnect$ = new Subject();

    private Input$ = merge(
        fromEvent(this, 'input').pipe(
            tap(() => this.onChange(new CustomEvent('change', {detail: this.innerText}))),
        ),
        fromEvent(this, 'focus').pipe(
            tap(() => this.Context.Focus(this.Path)),
        )
    ).pipe(
        takeUntil(this.disconnect$.asObservable())
    );

    public Subscribe() {
        this.Input$.subscribe();
    }

    private onChange: (content) => void = c => {};
    private Context: Context;
    private Path: Path;

    private Update() {
        const text = this.innerText;
        const newText = this.Context.toString();
        if (text == newText) {
        } else {
            this.innerText = newText;
        }

    }

    private static map = new Map<Path, ContextContentElement>();

    public static For(context: Context, path: Path, onChange: (content) => {}) {
        const key = context.getKey(path);
        if (!this.map.has(key)) {
            const element = document.createElement('context-content', {
                is: 'div'
            }) as ContextContentElement;
            element.Context = context;
            element.Path = path;
            element.onChange = onChange;
            this.map.set(key, element);
        }
        const div = this.map.get(key);
        div.Update();
        return div;
    }
}