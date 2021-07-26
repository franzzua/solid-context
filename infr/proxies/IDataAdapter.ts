export abstract class IDataAdapter<TActions, TState> {

    public State$: {
        subscribe(fn: (state: TState) => void): Function;
    };

    public Actions: TActions;
}