import {Injectable, utc} from "@hypertype/core";
import {ContextTree} from "../model/contextTree";
import {ContextCursor} from "../model/context.cursor";
import {Id, Path} from "..";
import {IDataAdapter} from "../contracts";
import {award} from "rdf-namespaces/dist/schema";
import {Context} from "../model/context";

@Injectable()
export class HierarchyService {
    constructor(private tree: ContextTree,
                private dataAdapter: IDataAdapter,
                private Cursor: ContextCursor) {

    }

    private async Update(target: {parent: Path, index: number}){
        if (!target)
            return;
        const child = this.tree.Items.get(this.Cursor.Current);
        const parent = this.Cursor.getParent();
        await this.dataAdapter.ChangePosition(child.Id, {
            id: parent.Id,
            index: parent.Children.indexOf(child)
        }, {
            id: target.parent[target.parent.length - 1],
            index: target.index
        });
        child.Move(this.Cursor.Path.slice(0, -1), target);
        this.Cursor.SetPath([...target.parent, child.Id]);
    }

    public async Add(){
        const path = this.Cursor.getParentPath();
        const index = this.Cursor.getCurrentIndex() + 1;
        const dbo = {
            Content: [{Text: ''}],
            Children: [],
            Id: this.dataAdapter.NewId(),
            Time: utc().toISO()
        }
        const parent = this.Cursor.getCurrent(path);
        const context = new Context(this.tree, dbo);
        this.tree.Add(context);
        parent.InsertAt(context, index);
        parent.Update.next();
        this.Cursor.SetPath([
            ...path, context.Id
        ])
        await this.dataAdapter.Create(dbo);
        await this.dataAdapter.Add(context.Id, parent.Id, index);
        return context;
    }

    public async MoveLeft() {
        const target = this.Cursor.getLeftMove();
        await this.Update(target);
    }

    public async MoveRight() {
        const target = this.Cursor.getRightMove();
        await this.Update(target);
    };

    public async MoveDown() {
        const target = this.Cursor.getBottomMove();
        await this.Update(target);
    };

    public async MoveUp() {
        const target = this.Cursor.getTopMove();
        await this.Update(target);
    };

}