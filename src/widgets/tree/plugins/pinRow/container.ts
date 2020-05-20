
import { Component, template, on, IComponentProps, methodCall } from "core";
import { IHashMap } from "core";
import { findParentNode } from "./../../../utils/util";
import { Tree, INode } from "./../../tree";
import { HeadTree } from "../../headtree/headtree";
import { ViewTree } from "./../../viewtree/viewtree";
import { IRow, IRange } from "./../../../grid/viewgrid/viewgrid";
import { supportSticky } from "./../../../grid/plugins/supportSticky";
import { Row } from "./Row";
import { writeProperty, reedProperty } from "./../../../utils/util";

export enum PIN_ROW_MODE {
    HIDDEN = 0, // плагин выключен
    ROOT = 1,   // прикреплять корневой узел
    NODE = 2,   // прикреплять последний узел
    GROUP = 3   // прикреплять группу узлов
}

export interface IContainerProps extends IComponentProps {
    mode: PIN_ROW_MODE;
}

interface IPinRowInfo<T extends INode> {
    node: T;
    offset: number;
}

@template({
    html: "",
    root: {
        tagName: "div",
        ref: "content",
        cl: {
            ngridpinrow: true,
            sticky: supportSticky,
            fixed: !supportSticky
        }
    }
})
export class Container<T extends INode> extends Component<IContainerProps> {

    public static REFS = {
        CONTENT: "content"
    };

    private mode: PIN_ROW_MODE;
    private tree: Tree<T>;
    private rowList: Row<T>[];
    private positionScrollTop: number;

    public setMode(mode: PIN_ROW_MODE): void {
        this.mode = mode;

        let hidden: boolean = mode === PIN_ROW_MODE.HIDDEN;
        this.css(Container.REFS.CONTENT, { display: hidden ? "none" : "block" });

        if (this.isRendered() && !hidden) {
            this.refresh(false);
        }
    }

    public attachTree(tree: Tree<T>): void {
        this.tree = tree;

        // @override
        let view: ViewTree<T> = tree.getView() as ViewTree<T>;
        let originalRegulateRange: (range: IRange) => IRange = reedProperty(view, "regulateRange");

        writeProperty(view, "regulateRange", (range: IRange): IRange => {
            range = originalRegulateRange(range);

            let showPins: number = this.rowList.reduce((result: number, row: Row<T>) => {
                return result + (row.isHidden() ? 0 : 1);
            }, 0);

            range.start += showPins;

            return range;
        });
    }

    public refresh(onlyInsertOrRemove: boolean): void {
        if (this.mode === PIN_ROW_MODE.HIDDEN) {
            return;
        }

        this.updateByMode(onlyInsertOrRemove);
    }

    private updateByMode(onlyInsertOrRemove: boolean): void {
        switch (this.mode) {
            case PIN_ROW_MODE.ROOT:
                this.updatePinRoot(onlyInsertOrRemove);
                break;
            case PIN_ROW_MODE.NODE:
                this.updatePinNode(onlyInsertOrRemove);
                break;
            case PIN_ROW_MODE.GROUP:
                this.updatePinGroupNode(onlyInsertOrRemove);
                break;
        }
    }

    private updatePinRoot(onlyInsertOrRemove: boolean): void {
        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;
        let root: T = this.tree.getData()[0] || null;
        let row = this.rowList[0];

        if (!this.tree.props.rootVisible) {
            root = root.children[0] as T;
        }

        row.setPosition(0);
        row.renderData(view, root, onlyInsertOrRemove);

        this.rowList.forEach((pinRow, index) => {
            if (index > 0) {
                pinRow.hide();
            }
        });
    }

    private updatePinNode(onlyInsertOrRemove: boolean): void {
        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;
        let scrollTop: number = reedProperty(view, "scrollTop");
        let dataList: T[] = reedProperty(view, "dataList");
        let bufferHeight: number = view.props.bufferHeight;

        if (onlyInsertOrRemove && scrollTop === this.positionScrollTop) {
            return;
        }

        this.positionScrollTop = scrollTop;

        let row: Row<T> = this.rowList[0];
        let index: number = Math.floor(scrollTop / bufferHeight);
        let first = dataList[index] || null;
        let second = dataList[index + 1] || null;

        if (first && first.leaf) {
            first = this.tree.getRowById(first.parentNodeId);
        }

        let offset: number = (!second || second.leaf) ? 0 : (scrollTop - index * bufferHeight);

        row.setPosition(-offset);
        row.renderData(view, first, onlyInsertOrRemove);

        this.rowList.forEach((r: Row<T>, i: number) => {
            if (i > 0) {
                r.hide();
            }
        });
    }

    private updatePinGroupNode(onlyInsertOrRemove: boolean): void {
        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;
        let scrollTop: number = reedProperty(view, "scrollTop");
        let dataList: T[] = reedProperty(view, "dataList");
        let renderedList: IRow<T>[] = reedProperty(view, "renderedList");
        let bufferHeight: number = view.props.bufferHeight;

        if (renderedList.length === 0) {
            return;
        }

        if (onlyInsertOrRemove && scrollTop === this.positionScrollTop) {
            return;
        }

        this.positionScrollTop = scrollTop;

        // updating

        let index: number = Math.floor(scrollTop / bufferHeight);
        let offset: number = scrollTop - index * bufferHeight;

        let lastPinNode: T = view.getData()[0];
        let pinList: IPinRowInfo<T>[] = [];

        let currNode: T;
        let nextNode: T;

        // найдем записи которые нужно прикрепить
        while (index < dataList.length) {
            currNode = dataList[index];
            nextNode = dataList[++index];

            lastPinNode = this.findPinNode(currNode, lastPinNode);

            if (lastPinNode.leaf) {
                break;
            }

            if (nextNode && nextNode.depth <= lastPinNode.depth) {
                pinList.push({ node: lastPinNode, offset });
                break;
            }

            pinList.push({ node: lastPinNode, offset: 0 });
        }

        // добавим недостающие строки
        if (pinList.length > this.rowList.length) {
            this.addPinRows(pinList.length - this.rowList.length);
        }

        // добьем pinList если кол-во строк больше чем pinList
        if (pinList.length < this.rowList.length) {
            this.addEmptyRows(pinList, this.rowList.length - pinList.length);
        }

        index = this.rowList.length - 1;
        pinList.forEach((pinItem: IPinRowInfo<T>, i: number) => {
            let pinRow = this.rowList[index - i];

            if (pinItem.node)  {
                offset = i * bufferHeight - pinItem.offset;

                pinRow.setPosition(Math.ceil(offset));
                pinRow.renderData(view, pinItem.node, onlyInsertOrRemove);

                pinRow.show();
            } else {
                pinRow.hide();
            }
        });
    }

    private findPinNode(node: T, pinNode: T): T {
        let parentNode: T;

        while (node) {
            if (node.parentNodeId !== null) {
                parentNode = this.tree.getRowById(node.parentNodeId);
            }

            if (parentNode === pinNode) {
                return node;
            }

            node = parentNode;
        }

        return null;
    }

    private addPinRows(count: number): void {
        let head: HeadTree<T> = this.tree.getHead() as HeadTree<T>;
        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;
        let row: Row<T>;

        for (let i = 0; i < count; ++i) {
            row = new Row();

            view.addSyncTable(row);
            row.appendChild(this.ref(Container.REFS.CONTENT));

            this.rowList.push(row);
        }

        head.refreshColSize();
    }

    private addEmptyRows(pinList: IPinRowInfo<T>[], count: number): void {
        for (let i = 0; i < count; ++i) {
            pinList.push({ node: null, offset: null });
        }
    }

    @on(Container.REFS.CONTENT, "mousedown")
    private mousedown(e: MouseEvent) {
        this.processEvent(e, "MouseDown", this.ref(Row.REFS.WRAP), false);
    }

    @on(Container.REFS.CONTENT, "mousedown")
    private click(e: MouseEvent) {
        this.processEvent(e, "Click", this.ref(Row.REFS.WRAP), false);
    }

    @on(Container.REFS.CONTENT, "mousedown")
    private mouseup(e: MouseEvent) {
        this.processEvent(e, "MouseUp", this.ref(Row.REFS.WRAP), true);
    }

    @on(Container.REFS.CONTENT, "mousedown")
    private dblclick(e: MouseEvent) {
        this.processEvent(e, "Dblclick", this.ref(Row.REFS.WRAP), true);
    }

    private processEvent(event: MouseEvent, eventName: string, rootNode: Node, needCheckAccuracy: boolean): void {
        let table: HTMLTableElement = findParentNode(event.target as Node, "table", rootNode) as HTMLTableElement;
        if (!table) {
            return;
        }

        let index: number = Array.prototype.indexOf.call(this.ref(Container.REFS.CONTENT).children, table.parentNode);
        if (index === -1) {
            return;
        }

        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;
        let row: Row<T> = this.rowList[index];

        // считываем состояния
        let viewRenderedList: IRow<T>[] = reedProperty(view, "renderedList");
        let viewRenderedHash: IHashMap<number> = reedProperty(view, "renderedHash");
        let rowRenderedList: IRow<T>[] = reedProperty(row, "renderedList");
        let rowRenderedHash: IHashMap<number> = reedProperty(row, "renderedHash");

        // временно подменим
        writeProperty(view, "renderedList", rowRenderedList);
        writeProperty(view, "renderedHash", rowRenderedHash);

        try {
            methodCall(view, "processEvent", [event, eventName, div, needCheckAccuracy]);
        } catch (e) {
            console.error(e);
        }

        // вернем обратно
        writeProperty(view, "renderedList", viewRenderedList);
        writeProperty(view, "renderedHash", viewRenderedHash);
    }

    private beforeInit(): void {
        if (typeof this.props.mode !== "number") {
            this.props.mode = PIN_ROW_MODE.HIDDEN;
        }
    }

    private afterInit(): void {
        this.setMode(this.props.mode);
    }

    private beforeMount(): void {
        let content: HTMLDivElement = this.ref(Container.REFS.CONTENT) as HTMLDivElement;

        this.rowList = [this.createRow()];

        this.rowList.forEach((row: Row<T>) => {
            row.appendChild(content);
        });
    }

    private beforeUnmount(): void {
        this.rowList.forEach((row: Row<T>) => {
            row.remove();
        });

        this.rowList = null;
    }

    private createRow(): Row<T> {
        let row: Row<T> = new Row();
        let view: ViewTree<T> = this.tree.getView() as ViewTree<T>;

        // очень важно!!! для синхронизации с основной таблицей
        view.addSyncTable(row);

        return row;
    }
}
