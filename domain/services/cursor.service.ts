import {Injectable} from "@hypertype/core";
import {Context, Path} from "..";
import {ContextTree} from "../model/contextTree";
import * as path from "path";

@Injectable()
export class CursorService {

    constructor(private tree: ContextTree) {
        this.tree.State$.subscribe(s => {
            this.SetPath([this.tree.Root.Id]);
        });
    }

    public Path: Path = [];


    public isRoot(path: Path = this.Path) {
        return path.length == 1;
    }


    SetPath(path: Path) {
        if (path == null || this.isCurrentPath(path))
            return;
        // console.log(path);
        this.Path = path;
        this.tree.SetActivePath(this.Path);
    }

    //#region Move Item

    // detect wher should move item

    public getLeftMove(path = this.Path): { parent: Path, index: number } {
        if (path.length < 3)
            return null;
        const grand = this.getGrand(path);
        const parent = this.getParent(path);
        const parentIndex = grand.Value.Children.indexOf(parent.Id);
        return {
            parent: path.slice(0, -2),
            index: parentIndex + 1
        };
    }

    public getRightMove(path = this.Path): { parent: Path, index: number } {
        if (this.isRoot(path))
            return null;
        const parent = this.getParent(path);
        const index = this.getIndex(path);
        if (index == 0)
            return null;
        const newParent = parent.Children[index - 1];
        return {
            parent: [
                ...path.slice(0, -1),
                newParent.Id,
            ],
            index: newParent.Value.Children.length
        };
    }

    public getTopMove(path = this.Path): { parent: Path, index: number } {
        if (this.isRoot(path))
            return null;
        const parent = this.getParent(path);
        const index = this.getIndex(path);
        if (index > 0)
            return {
                parent: path.slice(0, -1),
                index: index - 1
            };
        if (path.length == 2)
            return null;
        const grand = this.getGrand(path)
        const parentIndex = grand.Value.Children.indexOf(parent.Id);
        return {
            parent: path.slice(0, -2),
            index: parentIndex
        };
    }

    public getBottomMove(path = this.Path): { parent: Path, index: number } {
        if (this.isRoot(path))
            return null;
        const parent = this.getParent(path);
        const index = this.getIndex(path);
        if (index < parent.Value.Children.length - 1)
            return {
                parent: path.slice(0, -1),
                index: index + 1
            };
        return this.getLeftMove()
    }

    //#endregion

    //#region Move Cursor


    Up() {
        this.SetPath(this.GetUp());
    }

    Down() {
        this.SetPath(this.GetDown());
        console.log(this.Path);
    }


    GetUp(path = this.Path) {
        if (path.length == 1)
            return null;
        const parent = this.getParent(path);
        const index = this.getIndex(path);
        if (index > 0)
            return this.getLastChild([
                ...path.slice(0, -1),
                parent.Value.Children[index - 1]
            ]);
        return path.slice(0, -1)
    }

    GetDown(path = this.Path) {
        const current = this.getCurrent(path);
        if (current.Value.Children.length && !current.Collapsed) {
            return [
                ...path,
                current.Value.Children[0]
            ];
        }
        return this.getNextChild(path);
    }

    //#enregion

    getParentPath(path: Path = this.Path): Path {
        return path.slice(0, -1)
    }
    getParent(path: Path = this.Path): Context {
        const [parentId] = path.slice(-2);
        return this.tree.Items.get(parentId);
    }

    private getGrand(path: Path = this.Path): Context {
        const [grandId] = path.slice(-3);
        return this.tree.Items.get(grandId);
    }

    getIndex(path: Path = this.Path): number {
        const parent = this.getParent(path);
        const current = this.getCurrent(path);
        const index = parent.Value.Children.indexOf(current.Id);
        return index;
    }

    getCurrent(path: Path = this.Path): Context {
        const [currentId] = path.slice(-1);
        return this.tree.Items.get(currentId);
    }

    private isCurrentPath(path: Path){
        return path.length == this.Path.length && path.every((x,i) =>x == this.Path[i]);
    }

    private getLastChild(path: Path) {
        const current = this.getCurrent(path);
        if (current.Value.Children.length == 0 || current.Collapsed)
            return path;
        return this.getLastChild([
            ...path,
            current.Value.Children[current.Value.Children.length - 1]
        ])
    }

    private getNextChild(path: Path) {
        if (path.length == 1)
            return null;
        const parent = this.getParent(path);
        const index = this.getIndex(path);
        if (index < parent.Value.Children.length - 1)
            return [
                ...path.slice(0, -1),
                parent.Value.Children[index + 1]
            ];
        return this.getNextChild(path.slice(0, -1));
    }
}