import {ContextDbo, RelationType} from "../dbo/context.dbo";
import {User} from "./user";
import {Id, Path} from "./base/id";
import {ContextTree} from "./contextTree";
import {Leaf} from "./base/leaf";
import {Subject, debounceTime, tap, mapTo, Observable, ReplaySubject, shareReplay, startWith} from "@hypertype/core";

const emailRegex = /^([\w\.\-\d]+@[\w\.\-\d]+\.[\w\.\-\d]+)&/;

export class Context extends Leaf<ContextDbo, Id> {

    SetText(text: any) {
        this.Value.Content[0].Text = text;
        this.Update.next();
    }

    private get IsEmail() {
        if (this.Id == 'inbox')
            return true;
        return emailRegex.test(this.Value.Content[0].Text);
    }

    Users: Map<User, RelationType> = new Map<User, RelationType>();
    protected tree: ContextTree;
    public IsActive: boolean;
    public Collapsed: boolean = false;

    constructor(tree: ContextTree, dbo: ContextDbo) {
        super();
        this.tree = tree as any;
        this.Value = dbo;
        // if (this.IsEmail) {
        //     this.LoadEmails();
        // }
    }


    public GetDbo() {
        return [
            this.Value,
            ...this.Children.map(child => child.GetDbo())
        ].distinct(dbo => dbo.Id);
    }

    public toString() {
        return this.Value.Content.map(t => t['Text']).join(' ')
    }

    public get Id() {
        return this.Value.Id;
    }

    private _pathToKey = {};

    public getKey(path: Path) {
        const str = path.join(':');
        if (!this._pathToKey[str])
            this._pathToKey[str] = str;
        return this._pathToKey[str];
    }

    public Move(from: { id, index }, to: {id, index}) {
        const oldParent = this.tree.Items.get(from.id);
        const newParent = this.tree.Items.get(to.id);
        Object.keys(this._pathToKey).forEach(oldPath => {
            const newPath = oldPath.replace(`${from.id}`, `${to.id}`);
            this._pathToKey[newPath] = this._pathToKey[oldPath];
            delete this._pathToKey[oldPath];
        });
        // this._pathToKey[[...to, this.Id].join(':')] = this._pathToKey[[...from, this.Id].join(':')]
        if (from.id == to.id){
            oldParent.ChangeChildOrder(from.index, to.index);
        } else {
            oldParent.RemoveChild(this);
            newParent.InsertAt(this, to.index);
        }
    }


    public Update = new ReplaySubject<void>();
    public State$: Observable<Context> = this.Update.asObservable().pipe(
        startWith(null),
        mapTo(this),
        shareReplay(1)
    );

    ChangeChildOrder(oldIndex: number, newIndex: number){
        super.ChangeChildOrder(oldIndex, newIndex);
        this.Update.next(null);
    }

    RemoveChild(child: this) {
        super.RemoveChild(child);
        this.Update.next(null);
    }

    InsertAt(child: Context, index) {
        super.InsertAt(child as any, index);
        this.Update.next(null);
    }

    // Focus(path: Path) {
    //     this.tree.SetActivePath(path);
    // }


    public GetAllChildrenRecursive(): Context[] {
        return [
            this,
            ...this.Children.map(c => c.GetAllChildrenRecursive()).flat()
        ]
    }

    AddChild(child: Context, index: number) {
        this.Value.Children.push(child.Id);
        this.Update.next(null);
    }

}