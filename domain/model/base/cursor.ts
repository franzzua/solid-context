// import {Leaf} from "./leaf";
// import {ILeaf, Tree} from "./tree";
// import {Id, Path} from "./id";
// import {debounceTime, Observable, ReplaySubject, shareReplay, startWith} from "@hypertype/core";
// import {streetAddress} from "rdf-namespaces/dist/schema";
//
// export class TreeCursor<TLeaf extends Leaf<TValue, TKey>,
//     TValue extends ILeaf<TKey>,
//     TKey = Id> {
//
//     constructor(private tree: Tree<TLeaf, TValue, TKey>) {
//
//     }
//
//     public isRoot(path: Path<TKey> = this.Path) {
//         return path.length == 1;
//     }
//
//     public getCurrent(path: Path<TKey> = this.Path): TLeaf {
//         const [currentId] = path.slice(-1);
//         return this.tree.Items.get(currentId);
//     }
//     public getCurrentIndex(path: Path<TKey> = this.Path): number {
//         const parent = this.getParent(path);
//         const current = this.getCurrent(path);
//         const index = parent.Value.Children.indexOf(current.Id);
//         return index;
//     }
//
//
//     public getParent(path: Path<TKey> = this.Path): TLeaf {
//         const [parentId] = path.slice(-2);
//         return this.tree.Items.get(parentId);
//     }
//
//     public getGrand(path: Path<TKey> = this.Path): TLeaf {
//         const [grandId] = path.slice(-3);
//         return this.tree.Items.get(grandId);
//     }
//
//     public Path: Path<TKey> = [];
//
//     public get Current(): TKey{
//         return this.Path[this.Path.length - 1];
//     }
//
//     public getLeftMove(path = this.Path): { parent: Path<TKey>, index: number } {
//         if (path.length < 3)
//             return null;
//         const grand = this.getGrand(path);
//         const parent = this.getParent(path);
//         const parentIndex = grand.Value.Children.indexOf(parent.Id);
//         return {
//             parent: path.slice(0, -2),
//             index: parentIndex + 1
//         };
//     }
//
//     public getRightMove(path = this.Path): { parent: Path<TKey>, index: number } {
//         if (this.isRoot(path))
//             return null;
//         const parent = this.getParent(path);
//         const index = this.getCurrentIndex(path);
//         if (index == 0)
//             return null;
//         const newParent = parent.Children[index - 1];
//         return {
//             parent: [
//                 ...path.slice(0, -1),
//                 newParent.Id,
//             ],
//             index: newParent.Value.Children.length
//         };
//     }
//
//     public getTopMove(path = this.Path): { parent: Path<TKey>, index: number } {
//         if (this.isRoot(path))
//             return null;
//         const parent = this.getParent(path);
//         const index = this.getCurrentIndex(path);
//         if (index > 0)
//             return {
//                 parent: path.slice(0, -1),
//                 index: index - 1
//             };
//         if (path.length == 2)
//             return null;
//         const grand = this.getGrand(path)
//         const parentIndex = grand.Value.Children.indexOf(parent.Id);
//         return {
//             parent: path.slice(0, -2),
//             index: parentIndex
//         };
//     }
//
//     public getBottomMove(path = this.Path): { parent: Path<TKey>, index: number } {
//         if (this.isRoot(path))
//             return null;
//         const parent = this.getParent(path);
//         const index = this.getCurrentIndex(path);
//         if (index < parent.Value.Children.length - 1)
//             return {
//                 parent: path.slice(0, -1),
//                 index: index + 1
//             };
//         return this.getLeftMove()
//     }
//
//     public Update = new ReplaySubject<Path<TKey>>(1);
//     public Path$: Observable<Path<TKey>> = this.Update.pipe(
//         startWith(this.Path),
//         debounceTime(0),
//         shareReplay(1),
//     );
//
//     SetPath(path: TKey[]) {
//         if (path == null || this.isCurrentPath(path))
//             return;
//         // console.log(path);
//         this.Path = path;
//         console.log(path.map(x => x.toString().split('#').pop()));
//         this.Update.next(this.Path);
//     }
//
//     isCurrentPath(path: TKey[]){
//         return path.length == this.Path.length && path.every((x,i) =>x == this.Path[i]);
//     }
//
//     Up() {
//         this.SetPath(this.GetUp());
//     }
//
//     Down() {
//         this.SetPath(this.GetDown());
//     }
//
//
//     getLastChild(path: Path<TKey>) {
//         const current = this.getCurrent(path);
//         if (current.Value.Children.length == 0 || current.Collapsed)
//             return path;
//         return this.getLastChild([
//             ...path,
//             current.Value.Children[current.Value.Children.length - 1]
//         ])
//     }
//
//     getNextChild(path: Path<TKey>) {
//         if (path.length == 1)
//             return null;
//         const parent = this.getParent(path);
//         const index = this.getCurrentIndex(path);
//         if (index < parent.Value.Children.length - 1)
//             return [
//                 ...path.slice(0, -1),
//                 parent.Value.Children[index + 1]
//             ];
//         return this.getNextChild(path.slice(0, -1));
//     }
//
//     GetUp(path = this.Path) {
//         if (path.length == 1)
//             return null;
//         const parent = this.getParent(path);
//         const index = this.getCurrentIndex(path);
//         if (index > 0)
//             return this.getLastChild([
//                 ...path.slice(0, -1),
//                 parent.Value.Children[index - 1]
//             ]);
//         return path.slice(0, -1)
//     }
//
//     GetDown(path = this.Path) {
//         const current = this.getCurrent(path);
//         if (current.Value.Children.length && !current.Collapsed) {
//             return [
//                 ...path,
//                 current.Value.Children[0]
//             ];
//         }
//         return this.getNextChild(path);
//     }
//
//     getParentPath() {
//         if (this.isRoot())
//             return this.Path;
//         return  this.Path.slice(0, -1);
//     }
// }