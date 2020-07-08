import {Observable} from "@hypertype/core";
import {Stream} from "./stream";

export class ServiceProxy<TState, TActions> {
    constructor(private stream: Stream) {
    }

    public State$: Observable<TState> = this.stream.State$;

    public Actions: TActions = new Proxy({} as TActions, {
        get: (target: {}, p: PropertyKey, receiver: any) => {
            if (target[p]) return target[p];
            return target[p] = (...args) => this.stream.Invoke(p, args);
        }
    }) as TActions;
}