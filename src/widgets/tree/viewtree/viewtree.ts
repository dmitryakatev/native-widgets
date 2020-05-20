
import { IHashMap } from "core";
import { ViewGrid, IViewProps } from "./../../grid/viewgrid/viewgrid";
import { Tree, INode } from "./../tree";

export interface IViewTreeProps<T> extends IViewProps<T> { }

export class ViewTree<
        T extends INode = INode,
        P extends IViewTreeProps<T> = IViewTreeProps<T>,
        R extends Tree<T> = Tree<T>
    > extends ViewGrid<T, P, R> {

    public loadData(data: T[]): void {
        this.rawList = data;
        this.rawHash = {};

        if (data.length > 0) {
            this.initNodes(this.rawHash, null, [data[0]], 0);
        }

        this.refresh();
    }

    // преобразует дерево в список
    public updateListRender(): void {
        let tree: R = this.parent;
        let root: T = this.rawList[0];
        let nodeList: T[];

        if (root) {
            if (tree.props.rootVisible) {
                nodeList = [root];
            } else {
                nodeList = root.children as T[] || [];
            }
        } else {
            nodeList = [];
        }

        let list: T[] = [];

        nodeList.forEach((node) => {
            tree.cascadeBefore(node, (n: T) => {
                if (this.filterNode(n)) {
                    list.push(n);
                } else {
                    return false;
                }
            });
        });

        this.dataList = list;
    }

    public filterNode(node: T): boolean {
        if (node.parentNodeId === null) {
            return true;
        }

        let parent: T = this.getRowById(node.parentNodeId);
        return parent.expanded;
    }

    public scrollBy(node: T, isTop: boolean = true): void {
        let tree: R = this.parent;
        let parent: T = node.parentNode as T;

        while (parent/* && !parent.isRoot()*/) {
            if (!parent.expanded) {
                tree.expand(parent);
            }

            parent = parent.parentNode as T;
        }

        this.updateListRender();

        super.scrollBy(node, isTop);
    }

    private initNodes(hash: IHashMap<T>, parent: T, children: T[], depth: number): void {
        let getId: (item: T) => any = this.props.getId;
        let parentNodeId: any = parent ? getId(parent) : null;

        children.forEach((child: T, index: number) => {
            let first: boolean = index === 0;
            let last: boolean = children.length - 1 === index;
            let id: any = getId(child);

            if (hash.hasOwnProperty(id)) {
                console.error(`two nodes with same id: ${id}`);
                console.error(hash[id], child);
            } else {
                hash[id] = child;
            }

            child.parentNodeId = parentNodeId;
            child.prevNodeId = first ? null : getId(children[index - 1]);
            child.nextNodeId = last ? null : getId(children[index + 1]);

            child.expanded = child.expanded !== false;
            // icon
            // checked
            // checkedUndetermined
            child.depth = depth;

            if (Array.isArray(child.children)) {
                child.leaf = false;

                this.initNodes(hash, child, child.children as T[], depth + 1);
            } else {
                child.leaf = child.leaf !== false;
            }
        });
    }
}
