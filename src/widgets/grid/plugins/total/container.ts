
import { Component, template, IComponentProps, methodCall } from "core";
import { IHashMap } from "core";
import { Grid } from "./../../grid";
import { HeadGrid, IColumn } from "./../../headgrid/headgrid";
import { ViewGrid, IRow, IMeta } from "./../../viewgrid/viewgrid";
import { reedProperty, getScrollbarSize } from "./../../../utils/util";
import { supportSticky } from "./../../../grid/plugins/supportSticky";

@template({
    html: [
        `<div ref="wrap" class="npinrow">`,
            `<table ref="table">`,
                `<colgroup ref="cols"></colgroup>`,
                `<tbody ref="body"></tbody>`,
            `</table>`,
        `</div>`
    ].join(""),
    root: {
        tagName: "div",
        ref: "content",
        cl: {
            ngridpinrow: true,
            ngridtotal: true,
            sticky: supportSticky,
            fixed: !supportSticky
        }
    }
})
export class Container<T> extends Component<IComponentProps> {

    public static REFS = {
        CONTENT: "content",
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };

    protected renderedList: IRow<T>[];         // данные, которые были прорендерены (массив)
    protected renderedHash: IHashMap<any>;     // данные, которые были прорендерены (ключ -> индекс)

    public updateTop(grid: Grid<T>): void {
        let view: ViewGrid<T> = grid.getView();
        let content: HTMLDivElement = methodCall(view, "ref", [ViewGrid.REFS.CONTENT]);
        let boundContent: ClientRect = content.getBoundingClientRect();

        let wrapWidth: number = boundContent.width;

        if (view.props.bufferEnable) {
            let rowHeight: number = view.props.bufferHeight;
            let countRows: number = reedProperty(view, "dataList").length;
            let height: number = rowHeight * countRows;

            if (view.getHeight() < height) {
                wrapWidth -= getScrollbarSize();
            }
        } else {
            if (content.scrollHeight > content.clientHeight) {
                wrapWidth -= getScrollbarSize();
            }
        }

        this.css(Container.REFS.CONTENT, { width: wrapWidth + "px" });
    }

    public refresh(grid: Grid<T>, onlyInsertOrRemove: boolean): void {
        this.renderData(grid, onlyInsertOrRemove);

        let view: ViewGrid<T> = grid.getView();
        let rowHeight: number = view.props.bufferHeight;
        let iframeHeight: number = view.getIframeHeight();
        let top: number = iframeHeight  - rowHeight;

        this.css(Container.REFS.WRAP, { top: `${top}px` });
    }

    public renderData(grid: Grid<T>, onlyInsertOrRemove: boolean): void {
        if (onlyInsertOrRemove) {
            return;
        }

        let body: HTMLTableElement = this.ref(Container.REFS.BODY) as HTMLTableElement;
        let view: ViewGrid<T> = grid.getView();
        let columns: IColumn<T> = view.props.columns;

        let xtypes = columns.reduce((result: IHashMap<string>, column: IColumn<T>) => {
            result[column.id] = column.xtype;
            column.xtype = "totalcolumn";

            return result;
        }, {});

        let item: any = {
            id: -10,
            list: view.getData()
        };

        methodCall(view, "renderData", [this as any, body, { start: 0 }, [item], false]);

        columns.forEach((column: IColumn<T>) => {
            column.xtype = xtypes[column.id];
        });
    }

    protected beforeInit(): void {
        this.renderedList = [];
        this.renderedHash = {};
    }

}

// --------------------------------------------------

HeadGrid.registerColumn({
    xtype: "totalcolumn",
    renderer<T, R extends Grid<T>>(info: any, meta: IMeta<T, R>): string {
        if (meta.column.totalRenderer) {
            return meta.column.totalRenderer(info.list, meta);
        }

        return "";
    }
});
