import {fromEvent, Injectable, merge, tap} from "@hypertype/core";
import {ContextTree, CursorService, HierarchyService} from "@domain";

@Injectable()
export class KeyboardHandler {
    constructor(
        private hierarchy: HierarchyService,
        private tree: ContextTree,
        private cursor: CursorService
    ) {

    }


    public Actions$ = merge(
        fromEvent(document, 'keydown').pipe(
            tap((event: KeyboardEvent) => {
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        if (event.shiftKey && event.ctrlKey)
                            this.hierarchy.MoveUp();
                        else if (event.ctrlKey)
                            this.tree.Cursor.Up();
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (event.shiftKey && event.ctrlKey)
                            this.hierarchy.MoveDown();
                        else if (event.ctrlKey)
                            this.tree.Cursor.Down();
                        break;
                    case 'ArrowLeft':
                        if (event.shiftKey && event.ctrlKey)
                            this.hierarchy.MoveLeft();
                        break;
                    case 'ArrowRight':
                        if (event.shiftKey && event.ctrlKey)
                            this.hierarchy.MoveRight();
                        break;
                    case 'Delete':
                        if (event.shiftKey)
                            this.tree.Delete()
                        break;
                    case 'Tab':
                        event.preventDefault();
                        event.shiftKey ? this.hierarchy.MoveLeft() : this.hierarchy.MoveRight();
                        break;
                    case 'Enter':
                        if (!event.shiftKey) {
                            this.hierarchy.Add();
                            event.preventDefault();
                        }
                        break;
                    case 'Delete':
                        if (event.shiftKey) {
                            this.tree.Delete();
                            event.preventDefault();
                        }
                        break;
                    case '.':
                    case 'ю':
                        if (event.ctrlKey)
                            this.tree.switchCollapsed();
                    default:
                    // console.log(event.key)
                }

            })
        ),

        fromEvent(document, 'keyup').pipe(
            tap(() => {

            })
        )
    );
}