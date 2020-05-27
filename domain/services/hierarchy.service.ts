import {Injectable, utc} from "@hypertype/core";
import {ContextTree} from "../model/contextTree";
import {CursorService} from "./cursor.service";
import {IDataAdapter} from "../contracts";
import {Context} from "../model/context";
import {child} from "rdf-namespaces/dist/contact";
import {Path} from "..";

@Injectable()
export class HierarchyService {
    constructor(private tree: ContextTree,
                private dataAdapter: IDataAdapter,
                private Cursor: CursorService) {

    }

    private async MoveCurrent(target: { parent: Path, index: number }, copy = false) {
        if (!target)
            return;
        const child = this.tree.Items.get(this.Cursor.getCurrent().Id);
        const parent = this.Cursor.getParent();
        if (copy) {
            await this.dataAdapter.AddChild(child.Id,
                target.parent[target.parent.length - 1],
                 target.index);
            parent.AddChild(child, target.index);
        }else {
            await this.dataAdapter.ChangePosition(child.Id, {
                id: parent.Id,
                index: parent.Children.indexOf(child)
            }, {
                id: target.parent[target.parent.length - 1],
                index: target.index
            });
            child.Move({
                id: parent.Id,
                index: parent.Children.indexOf(child)
            }, {
                id: target.parent[target.parent.length - 1],
                index: target.index
            });
        }
        this.Cursor.SetPath([...target.parent, child.Id]);
    }

    public async Add(context: Context = null) {
        const path = this.Cursor.getParentPath();
        const index = this.Cursor.getIndex() + 1;
        if (!context) {
            const dbo = {
                Content: [{Text: ''}],
                Children: [],
                Id: this.dataAdapter.NewId(),
                Time: utc().toISO()
            }
            context = new Context(this.tree, dbo);
            await this.dataAdapter.Create(dbo);
        }
        const parent = this.Cursor.getCurrent(path);
        this.tree.Add(context);
        parent.InsertAt(context, index);
        parent.Update.next();
        this.Cursor.SetPath([
            ...path, context.Id
        ])
        await this.dataAdapter.AddChild(context.Id, parent.Id, index);
        return context;
    }

    public async MoveLeft(copy = false) {
        const target = this.Cursor.getLeftMove();
        await this.MoveCurrent(target, copy);
    }

    public async MoveRight(copy = false) {
        const target = this.Cursor.getRightMove();
        await this.MoveCurrent(target, copy);
    };

    public async MoveDown() {
        const target = this.Cursor.getBottomMove();
        await this.MoveCurrent(target);
    };

    public async MoveUp() {
        const target = this.Cursor.getTopMove();
        await this.MoveCurrent(target);
    };

    public async DeleteCurrent() {
        const current = this.Cursor.getCurrent();
        const parent = this.Cursor.getParent();
        const index = parent.Children.indexOf(current);
        parent.RemoveChild(current);
        await this.dataAdapter.RemoveChild(parent.Id, index);
        if(current.Parents.size == 0){
            await this.dataAdapter.Delete(current.GetAllChildrenRecursive().map(c => c.Id));
        }
    }

}