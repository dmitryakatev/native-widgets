
import { Component, template, IComponentProps, methodCall } from "core";
import { IHashMap } from "core";
import { ViewTree } from "./../../viewtree/viewtree";
import { IRow } from "./../../../grid/viewgrid/viewgrid";

@template({
    html: [
        `<table ref="table">`,
            `<colgroup ref="cols"></colgroup>`,
            `<tbody ref="body"></tbody>`,
        `</table>`
    ].join(""),
    root: {
        tagName: "div",
        ref: "wrap",
        cl: {
            npinrow: true
        }
    }
})
export class Row<T> extends Component<IComponentProps> {

    public static REFS = {
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };

    protected hidden: boolean;
    protected renderedList: IRow<T>[];         // данные, которые были прорендерены (массив)
    protected renderedHash: IHashMap<any>;     // данные, которые были прорендерены (ключ -> индекс)

    public show(): void {
        this.hide(false);
    }

    public hide(hidden: boolean = true): void {
        this.hidden = hidden;
        this.css(Row.REFS.WRAP, { display: hidden ? "none" : "block" });
    }

    public setPosition(top: number): void {
        this.css(Row.REFS.WRAP, { top: top ? `${top}px` : `` });
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public renderData(view: ViewTree<T>, nextNode: T, onlyInsertOrRemove: boolean): void {
        let currNode: T = this.renderedList.length > 0 ? this.renderedList[0].data : null;

        if (!onlyInsertOrRemove || currNode !== nextNode) {
            let nodeList: T[] = nextNode ? [nextNode] : [];
            let body: HTMLTableElement = this.ref(Row.REFS.BODY) as HTMLTableElement;

            methodCall(view, "renderData", [this, body, { start: 0 }, nodeList, false]);
        }
    }

    private beforeInit(): void {
        this.renderedList = [];
        this.renderedHash = {};
    }
}
