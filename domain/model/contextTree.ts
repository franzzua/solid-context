import {Id, Path} from "./base/id";
import {Tree} from "./base/tree";
import {Context} from "./context";
import {ContextDbo, ContextState, RootDbo} from "../dbo/context.dbo";
import {User} from "./user";
import {debounceTime, Injectable, mapTo, Observable, ReplaySubject, shareReplay, Subject, of} from "@hypertype/core";
import {CursorService, HierarchyService} from "@domain/services";
import {KeyboardHandler} from "../../ui/handlers/keyboard.handler";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";
import {IDataActions} from "@domain/contracts";
import {publicAccess} from "rdf-namespaces/dist/schema";
import {content_encoded} from "rdf-namespaces/dist/sioc";

class LocalStorage {
    public static Add = (target, key, desc) => {

    }
}

@Injectable()
export class ContextTree extends Tree<Context, ContextDbo, Id> {

    public IdFactory: () => Id;

    constructor() {
        super();
        window['root'] = this;

    }

    public async Send(to: string, content: string) {
    }

    Items: Map<Id, Context>;
    Root: Context;

    get Parent() {
        return null;
    }

    get Children() {
        return [this.Root];
    }

    UserMap: Map<Id, User>;
    CurrentUser: User;

    public Load(dbo?: RootDbo) {
        if (!dbo) {
            this.Root = null;
            this.UserMap = new Map();
            this.Items = new Map();
            this.Update.next();
            return;
        }
        this.UserMap = new Map(dbo.Users.map(userDbo => [userDbo.Id, new User(userDbo)]));
        // const mainContextDbo = dbo.Contexts.find(c => c.Parents.length == 0);
        // const contextDboTree = treeMap<ContextDbo>(mainContextDbo, item => dbo.Contexts
        //     .filter(c => c.Parents.includes(item.Id)));
        // this.Root = contextDboTree.map(t => new Context(this, t));
        if (!this.Items) {
            this.Items = new Map(dbo.Contexts
                .map(dbo => [dbo.Id, new Context(this, dbo)]));
        } else {

            for (let x of this.Items.keys()) {
                if (dbo.Contexts.every(c => c.Id != x)) {
                    this.Items.delete(x);
                }
            }
            for (let x of dbo.Contexts) {
                const existed = this.Items.get(x.Id);
                if (!existed) {
                    this.Items.set(x.Id, new Context(this, x))
                } else {
                    existed.Value = x;
                }
            }
        }

        this.Root = this.Items.get(dbo.Root);

        this.SetParents();

        dbo.Relations.forEach(relation => {
            const context = this.Items.get(relation.ContextId);
            const user = this.UserMap.get(relation.UserId);
            user.Contexts.set(context, relation.Type);
            context.Users.set(user, relation.Type);
        });

        (Object.entries(dbo.UserState.ContextsState) as [Id, ContextState][])
            .forEach(([key, state]) => {
                const context = this.Items.get(key);
                context.Collapsed = state.Collapsed;
            });

        if (this.Items.get('inbox')) {
            //const inbox = this.Items.get('inbox');
            //inbox.SetText(`Inbox (${this.email.me})`);
            // inbox.LoadEmails();
        }
        this.Update.next();
        [...this.Items.values()].forEach(x => x.Update.next());
        console.log('reload tree');
    }

    public ToDbo(): RootDbo {
        return {
            Root: this.Root.Id,
            Contexts: Array.from(this.Items.values())
                .map(ctx => ctx.Value),
            Users: Array.from(this.UserMap.values())
                .map(user => user.Data),
            Relations: Array.from(this.Items.values())
                .map(ctx => [...ctx.Users.entries()].map(([user, type]) => ({
                    ContextId: ctx.Id,
                    UserId: user.Data.Id,
                    Type: type
                })))
                .flat(),
            UserState: {
                ContextsState: {}
            }
        }
    }

    public Update = new ReplaySubject<void>(1);
    public OnAdd = new ReplaySubject<Context>(1);
    public State$: Observable<ContextTree> = this.Update.pipe(
        debounceTime(0),
        // tap(() => {
        //     console.log(...this.Root.flatMap(t => t.Path));
        // }),
        mapTo(this),
        shareReplay(1),
    );

    public Add(context: Context) {
        this.Items.set(context.Id, context);
    }

    // Delete() {
    //     this.Cursor.getParent().RemoveChild(this.Cursor.getCurrent());
    // }


    // switchCollapsed() {
    //     const current = this.Cursor.getCurrent()
    //     current.Collapsed = !current.Collapsed;
    //     current.Update.next();
    // }

    private currentPathSubject$ = new ReplaySubject<Path>();
    public CurrentPath$: Observable<Path> = this.currentPathSubject$.pipe(
        shareReplay(1)
    );

    public SetActivePath(path: Path) {
        this.currentPathSubject$.next(path);
    }

    public Cursor = new CursorService(this);


    public Actions = new EventDataAdapter();
    public Events$ = this.Actions.eventsSubject$.asObservable();

    public Hierarchy = new HierarchyService(this, this.Actions, this.Cursor);
    public Keyboard = new KeyboardHandler(this.Hierarchy, this, this.Cursor);

}

export class EventDataAdapter implements IDataActions {
    public readonly eventsSubject$ = new Subject<{
        type: "add" | "update" | "move" | "clear" |
            "create" | "delete" | "detach";
        data: any;
    }>();


    async AddChild(childId: Id, parentId: Id, index: number): Promise<void> {
        this.eventsSubject$.next({
            type: "add",
            data: {childId, parentId, index}
        });
    }

    async ChangeContent(id: Id, content: any): Promise<void> {
        this.eventsSubject$.next({
            type: "update",
            data: {id, content}
        });
    }

    async ChangePosition(id: Id, from: { id: Id; index: number }, to: { id: Id; index: number }): Promise<void> {
        this.eventsSubject$.next({
            type: "move",
            data: {id, from, to}
        });
    }

    async Clear(): Promise<any> {
    }

    async Create(context: ContextDbo): Promise<ContextDbo> {
        context.Id = performance.now().toString();
        this.eventsSubject$.next({
            type: "create",
            data: context
        });
        return context;
    }

    async Delete(ids: Id[]): Promise<any> {
        this.eventsSubject$.next({
            type: "delete",
            data: ids
        });
    }

    async Init(session): Promise<any> {
        return Promise.resolve(undefined);
    }

    async Load(): Promise<RootDbo> {
        return Promise.resolve(undefined);
    }

    async RemoveChild(parentId: Id, index: number): Promise<void> {
        this.eventsSubject$.next({
            type: "detach",
            data: {parentId, index}
        });
    }

}
