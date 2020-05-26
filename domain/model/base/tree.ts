import {Id} from "./id";
import {Leaf} from "./leaf";
import {TreeCursor} from "./cursor";

export interface ILeaf<TKey> {
    Id: TKey;
    Children: TKey[];
}

export abstract class Tree<TLeaf extends Leaf<TValue, TKey>,
    TValue extends ILeaf<TKey>,
    TKey = Id> {

    public abstract get Root(): TLeaf;

    public abstract get Items(): Map<TKey, TLeaf>;

    private get Leafs(): TLeaf[] {
        return Array.from(this.Items.values());
    }

    public SetParents() {
        this.Items.forEach(leaf => leaf.Parents = new Map());
        const parents = this.Leafs
            .map(parent => parent.Children.map(child => ({child, parent})))
            .flat()
            .groupBy(({child}) => child);
        Array.from(parents.entries())
            .forEach(([child, parents]) => {
                child.Parents = new Map(parents.map(({parent}) => [parent.Id, parent]));
            });
    }


}

/*
export function treeMap<T>(root: T, children: (t: T) => T[]) {
    return {
        map: <U extends Leaf<U>>(fn: (t: T) => U) => {
            const mapItem = item => {
                const result = fn(item);
                result.Path =
                    result.Children = children(item)
                        .map(mapItem);
                result.Children.forEach(child => child.Parent = result);
                return result;
            };
            return mapItem(root);
        },
        forEach: (fn: (t: T) => void | any) => {
            const forEachItem = item => {
                fn(item);
                children(item)
                    .forEach(forEachItem);
            };
            forEachItem(root);
        }
    }
}
*/