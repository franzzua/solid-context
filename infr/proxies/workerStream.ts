import {tap, filter, first, from, fromEvent, map, Observable, shareReplay, switchMap} from "@hypertype/core";
import {Stream, WorkerFactory, WorkerType} from "@infr/proxies/stream";

export class WorkerStream extends Stream {
    private worker: Promise<Worker | ServiceWorker>;
    private messages$: Observable<{ type: 'state' | 'response', payload, id? }>;

    constructor(path, type: WorkerType = WorkerType.WebWorker) {
        super();
        this.worker = WorkerFactory[type](path);
        this.messages$ = from(this.worker).pipe(
            switchMap(worker => fromEvent<MessageEvent>(worker, 'message')),
            shareReplay(0),
            map(x => x.data),
            tap(console.log),
        );
        this.State$ = this.messages$.pipe(
            filter(x => x.type == 'state'),
            map(x => x.payload),
            shareReplay(1),
        );
    }

    private id = 0;

    async Invoke(method: PropertyKey, args: any[]): Promise<any> {
        const id = `${this.id++}:${+new Date()}`;
        (await this.worker).postMessage({
            method, args, id
        });
        return await this.messages$.pipe(
            filter(x => x.type == "response"),
            filter(x => x.id == id),
            map(x => x.payload),
            first()
        ).toPromise();
    }
}