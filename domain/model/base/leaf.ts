import {ILeaf, Tree} from "./tree";
import {Id, Path} from "./id";
import { Fn } from "@hypertype/core";

export abstract class Leaf<TValue extends ILeaf<TKey>, TKey = Id> {

    protected tree: Tree<this, TValue, TKey> & any;

    Value: TValue;

    // flatMap<U>(fn: (t: TValue) => U) {
    //     return [
    //         fn(this.Value),
    //         ...this.Children.map(c => c.flatMap(fn)).flat()
    //     ];
    // }
    //
    // map<U extends Leaf<U>>(fn: (t: TValue) => U) {
    //     const mapItem = item => {
    //         const result = fn(item);
    //         result.Children = item.Children
    //             .map(mapItem);
    //         return result;
    //     };
    //     return mapItem(this);
    // }
    //
    // forEach(fn: (t: TValue) => void | any) {
    //     const forEachItem = item => {
    //         fn(item);
    //         item.Children.forEach(forEachItem);
    //     };
    //     forEachItem(this);
    // }

    get(ids: TKey[]): this {
        const [id, ...rest] = ids;
        const child = this.Children.find(c => c.Id == id);
        if (!child)
            return null;
        if (!rest.length)
            return child;
        return child.get(rest);
    }

    abstract get Id(): TKey;
    // Path: Path<TKey>;
    public Parents: Map<TKey, this> = new Map<TKey, this>();

    get Children(): this[] {
        return this.Value.Children.map(key => this.tree.Items.get(key)).filter(Fn.Ib);
    }


    protected RemoveChild(child: this) {
        child.Parents.delete(this.Id);
        this.Value.Children.remove(child.Id);
    }

    InsertAt(child: this, index) {
        child.Parents.set(this.Id, this);
        this.Value.Children.splice(index, 0, child.Id);
    }

    protected Switch(index1: number, index2: number) {
        const temp = this.Value.Children[index1];
        this.Value.Children[index1] = this.Value.Children[index2];
        this.Value.Children[index2] = temp;
    }

    ChangeChildOrder(from: number, to: number) {
        const child = this.Value.Children[from];
        this.Value.Children.splice(from, 1);
        this.Value.Children.splice(to, 0, child);
    }

    Collapsed: boolean = false;
    // protected MoveLeft(child: this) {
    //     const children = this.Children;
    //     children.indexOf(child);
    //     const index = this.Parent.Parent.Children.indexOf(this.Parent);
    //     const grandParent = this.Parent.Parent;
    //     this.Parent.Children.remove(this.this);
    //     grandParent.Children.splice(index + 1, 0, this.this);
    //     this.Path = [...grandParent.Path, this.Id];
    // }
    //
    // protected MoveRight() {
    //     if (!this.Parent || !this.PrevSibling)
    //         return;
    //     const prevSibling = this.PrevSibling;
    //     this.Parent.Children.remove(this.this);
    //     prevSibling.Children.push(this.this);
    //     this.Path = [...prevSibling.Path, this.Id];
    // }
    //
    // protected MoveUp() {
    //     if (!this.Parent || !this.PrevSibling)
    //         return;
    //     const index = this.Parent.Children.indexOf(this.this);
    //     this.Parent.Children.splice(index - 1, 2, this.this, this.Parent.Children[index - 1]);
    // }
    //
    // protected MoveDown() {
    //     if (!this.Parent)
    //         return;
    //     if (this.NextSibling) {
    //         const index = this.Parent.Children.indexOf(this.this);
    //         this.Parent.Children.splice(index, 2, this.Parent.Children[index + 1], this.this);
    //     } else {
    //         this.MoveLeft();
    //     }
    // }
    //
    //
    // get PrevSibling(): TValue {
    //     return this.Parent && this.Parent.Children[this.Parent.Children.indexOf(this.this) - 1];
    // }
    //
    // get NextSibling(): TValue {
    //     return this.Parent && this.Parent.Children[this.Parent.Children.indexOf(this.this) + 1];
    // }
    //
    // public get Prev(): TValue {
    //     return this.PrevSibling || this.Parent;
    // }
    //
    // public get Next(): TValue {
    //     return this.Children[0] || this.NextSibling || (this.Parent && this.Parent.NextSibling);
    // }
}

