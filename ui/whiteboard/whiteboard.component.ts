import {Component, HyperComponent} from "@hypertype/ui";
import {IEvents, IState, Template} from "./whiteboard.template";
import {Fn, filter, tap, map, first, combineLatest, shareReplay} from "@hypertype/core";
import {fabric} from "fabric";

@Component({
    name: 'ctx-whiteboard',
    template: Template,
    style: require('./whiteboard.style.less')
})
export class WhiteboardComponent extends HyperComponent<IState, IEvents> {

    constructor() {
        super();

        this.fabric$.subscribe();
        this.Size$.subscribe();
    }


    private fabric$ = this.select<HTMLCanvasElement>('canvas').pipe(
        filter(Fn.Ib),
        first(),
        map(canvas => {
            this.fabric = new fabric.Canvas(canvas, {
                interactive: true,
            });
            this.fabric.on('path:created', (e: any) => {
                this.fabric.isDrawingMode = false;
                const text = new fabric.Textbox('hi',{
                    left: e.path.pathOffset.x,
                    top: e.path.pathOffset.y
                });
                this.fabric.add(text);
                this.fabric.setActiveObject(text);
            });
            const rect = new fabric.Rect({
                top: 100,
                left: 100,
                width: 60,
                height: 70,
                fill: 'red'
            });
            this.fabric.add(rect);
            return this.fabric;
        }),
        shareReplay(1)
    );

    private Size$ = combineLatest([this.ClientRect$, this.fabric$]).pipe(
        tap(([rect, fabric]) => {
            fabric.setWidth(rect.width);
            fabric.setHeight(rect.height);
        })
    );


    public Events = {
        draw: () => {
            this.fabric.isDrawingMode = true;
        }
    };

    private fabric: fabric.Canvas;
}
    