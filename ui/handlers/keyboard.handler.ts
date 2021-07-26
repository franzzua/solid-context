import {fromEvent, Injectable, merge, tap} from "@hypertype/core";
import {Context, ContextTree, CursorService, HierarchyService} from "@domain";

@Injectable()
export class KeyboardHandler {
    private copy: Context;
    constructor(
        private hierarchy: HierarchyService,
        private tree: ContextTree,
        private cursor: CursorService
    ) {

    }

    private Action(event: KeyboardEvent){
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                if (event.shiftKey && event.ctrlKey)
                    this.hierarchy.MoveUp();
                else if (event.ctrlKey)
                    this.cursor.Up();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (event.shiftKey && event.ctrlKey)
                    this.hierarchy.MoveDown();
                else if (event.ctrlKey)
                    this.cursor.Down();
                break;
            case 'ArrowLeft':
                if (event.shiftKey && event.ctrlKey)
                    this.hierarchy.MoveLeft(false);
                break;
            case 'ArrowRight':
                if (event.shiftKey && event.ctrlKey)
                    this.hierarchy.MoveRight(false);
                break;
            case 'Tab':
                event.preventDefault();
                event.shiftKey ? this.hierarchy.MoveLeft() : this.hierarchy.MoveRight(false);
                break;
            case 'Enter':
                if (!event.shiftKey) {
                    this.hierarchy.Add();
                    event.preventDefault();
                }
                break;
            case 'Delete':
                if (event.shiftKey) {
                    this.hierarchy.DeleteCurrent();
                    event.preventDefault();
                }
                break;
            case 'C':
                if (event.ctrlKey)
                    this.copy = this.cursor.getCurrent();
                event.preventDefault();
                break;
            case 'V':
                if (event.ctrlKey)
                    this.hierarchy.Add(this.copy);
                event.preventDefault();
                break;
            case '.':
            case 'ю':
                if (event.ctrlKey){
                    const current = this.cursor.getCurrent();
                    current.Collapsed = !current.Collapsed;
                    current.Update.next(null);
                }
            default:
            // console.log(event.key)
        }

    }

    public Actions$ = merge(
        fromEvent(document, 'keydown').pipe(
            tap((event: KeyboardEvent) => {
                this.Action(event);
            })
        ),

        fromEvent(document, 'keyup').pipe(
            tap(() => {

            })
        )
    );
}