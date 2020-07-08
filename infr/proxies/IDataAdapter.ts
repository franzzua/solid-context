export abstract class IDataAdapter<TActions> {

    public State$: {
        subscribe(fn: Function): Function;
    };

    public Actions: TActions;
}