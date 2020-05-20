
import { event, methodCall, dom, IHashMap } from "core";
import { Grid } from "./../../grid";
import { HeadGrid, IColumn } from "../../headgrid/headgrid";
import { ViewGrid } from "../../viewgrid/viewgrid";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";

interface IColumnInfo<T> {
    column: IColumn<T>;
    width: number;
    flex: number;
}

interface ISize {
    width: number;
    flex: number;
}

interface IResize<T> {
    position: number;
    left: number;
    info: IColumnInfo<T>[];

    currColumn: IColumn<T>;
    nextColumn: IColumn<T>;
    currColumnWidth: number;
    nextColumnWidth: number;
    maxDiffLastColumn: number;
}

export class ResizeColumnsPlugin<T> implements IPlugin {

    private grid: Grid<T>;
    private line: HTMLDivElement;
    private showLine: boolean;

    private resizeCursor: boolean;
    private resize: IResize<T>;

    private windowEvents: IHashMap<(event: MouseEvent) => void>;
    private events: IHashMap<(event: MouseEvent) => void>;

    constructor(props: IPluginProps, grid: Grid<T>) {
        this.grid = grid;

        this.line = null;
        this.showLine = false;

        this.resizeCursor = false;
        this.resize = null;

        this.events = {
            mousedown: (e: MouseEvent) => {
                this.onMouseDown(e);
            },
            mousemove: (e: MouseEvent) => {
                this.onMouseMove(e);
            },
            mouseleave: (e: MouseEvent) => {
                this.onMouseLeave(e);
            }
        };

        this.windowEvents = {
            mousemove: (e: MouseEvent) => {
                this.onResizeColumn(e);
            },
            mouseup: (e: MouseEvent) => {
                this.onDoneResizeColumn(e);
            }
        };
    }

    public findResizableColumn(td: HTMLTableCellElement, e: MouseEvent): IColumn<T> {
        let head: HeadGrid<T> = this.grid.getHead();

        // если td не найдено, то возьмем последнюю
        if (!td) {
            let body = methodCall(head, "ref", [HeadGrid.REFS.BODY]);
            let tr = body.children[body.children.length - 1];

            td = tr.children[tr.children.length - 1];
        }

        let rect: ClientRect = td.getBoundingClientRect();
        let mouseX: number = e.clientX;
        let distance: number = 8;

        let column: IColumn<T> = null;

        if (rect.right - mouseX <= distance && mouseX - rect.right <= distance) {
            column = head.getColumnByTd(td);
        } else {
            if (mouseX - rect.left <= distance) {
                // я думаю при многоуровневой шапке, тут будет не правильно работать !!!
                td = td.previousSibling as any; // TODO
                column = head.getColumnByTd(td);
            }
        }

        if (column && column.resizable) {
            return column;
        }

        return null;
    }

    public updateResizeCursor(resizable: boolean): void {
        let cls: string = "ngrid-cursor-resize";

        if (resizable !== this.resizeCursor) {
            this.resizeCursor = resizable;
            dom.cl(document.body, { [cls]: !resizable }, { [cls]: resizable }, false);
        }
    }

    public onMouseDown(e: MouseEvent): void {
        let head: HeadGrid<T> = this.grid.getHead();
        let view: ViewGrid<T> = this.grid.getView();

        let el: HTMLElement = e.target as HTMLElement;
        let td: HTMLTableCellElement = head.getTdByEl(el);
        let column: IColumn<T> = this.findResizableColumn(td, e);

        if (column) {
            let tableBody: HTMLTableElement = methodCall(head, "ref", [HeadGrid.REFS.BODY]);
            let columns: IColumn<T>[] = head.getColumnsDown();
            let index: number = columns.indexOf(column);
            let nextColumn: IColumn<T> = columns[index + 1] || null;
            let columnsFlex: IColumn<T>[] = columns.filter((c: IColumn<T>) => c.flex !== null);

            let info: IColumnInfo<T>[] = columnsFlex.map((c: IColumn<T>) => {
                let width: number;

                if (c.width === null) {
                    let selector: string = `td[data-num="${c.id}"]`;
                    let tableCell: HTMLTableCellElement = tableBody.querySelector(selector);
                    let bound: ClientRect = tableCell.getBoundingClientRect();

                    width = bound.width;
                } else {
                    width = c.width;
                }

                return {
                    column: c,
                    width,
                    flex: c.flex
                };
            });

            let currColumnWidth: number = null;
            let nextColumnWidth: number = null;
            let maxDiffLastColumn: number = null;

            if (column.flex === null) {
                currColumnWidth = column.width;
            } else {
                let columnInfo: IColumnInfo<T> = info.filter((inf: IColumnInfo<T>) => {
                    return  inf.column === column;
                })[0];

                currColumnWidth = columnInfo.width;
            }

            if (!nextColumn || !nextColumn.resizable) {
                nextColumn = null;

                let viewWrap: HTMLDivElement = methodCall(view, "ref", [ViewGrid.REFS.WRAP]);
                let wrapWidth: number = viewWrap.getBoundingClientRect().width;
                let iframeWidth: number = view.getIframeWidth();

                maxDiffLastColumn = iframeWidth - wrapWidth;
            } else {
                nextColumnWidth = nextColumn.flex === null ?
                nextColumn.width : info.filter((c) => c.column === nextColumn)[0].width;
            }

            let headEl: HTMLDListElement = methodCall(head, "ref", [HeadGrid.REFS.HEAD]);
            let boundHead: ClientRect = headEl.getBoundingClientRect();
            let currTd: HTMLTableCellElement = tableBody.querySelector(`td[data-num="${column.id}"]`);
            let currBound: ClientRect = currTd.getBoundingClientRect();

            this.resize = {
                position: e.clientX,
                left: currBound.right - boundHead.left,
                info,

                currColumn: column,
                nextColumn,
                currColumnWidth,
                nextColumnWidth,
                maxDiffLastColumn
            };

            event.on(window as any, this.windowEvents);
        }

        this.updateResizeCursor(!!column);
    }

    public onMouseMove(e: MouseEvent): void {
        if (this.resize === null) {
            let head: HeadGrid<T> = this.grid.getHead();
            let td: HTMLTableCellElement = head.getTdByEl(e.target as HTMLElement);
            let column: IColumn<T> = this.findResizableColumn(td, e);

            this.updateResizeCursor(!!column);
        }
    }

    public onMouseLeave(e: MouseEvent): void {
        if (!this.resize) {
            this.updateResizeCursor(false);
        }
    }

    public onResizeColumn(e: MouseEvent): void {
        let diff: number = e.clientX - this.resize.position;

        // --------

        let column: IColumn<T> = this.resize.currColumn;
        let width: number = this.resize.currColumnWidth;
        let minWidth: number = column.minWidth === null ? 0 : column.minWidth;

        if (width + diff < minWidth) {
            diff = minWidth - width;
        }

        // --------

        if (!this.resize.nextColumn) {
            if (this.resize.maxDiffLastColumn > diff) {
                diff = this.resize.maxDiffLastColumn;
            }
        }
        // --------

        let left: number = this.resize.left;
        let position: number = left + diff;

        this.line.style.left = `${position}px`;

        this.showVerticalLine();
    }

    public onDoneResizeColumn(e: MouseEvent): void {
        this.applySizeColumn(e);

        event.off(window as any, this.windowEvents);

        this.hideVerticalLine();
        this.updateResizeCursor(false);

        // очищаем не сразу, чтобы не сработал клик для сортировки
        setTimeout(() => {
            this.resize = null;
        }, 50);
    }

    public applySizeColumn(e: MouseEvent): void {
        // жизнь боль
        let currColumn: IColumn<T> = this.resize.currColumn;
        let nextColumn: IColumn<T> = this.resize.nextColumn;
        let currColumnWidth: number = this.resize.currColumnWidth;
        let nextColumnWidth: number = this.resize.nextColumnWidth;
        let diff: number = e.clientX - this.resize.position;

        let newCurrColumnWidth: number = currColumnWidth;
        let newNextColumnWidth: number = nextColumnWidth;
        let minWidth: number;

        let flexInfo: ISize = this.resize.info.reduce((result, info) => {
            result.flex += info.flex;
            result.width += info.width;

            return result;
        }, { flex: 0, width: 0 });

        // --------

        minWidth = currColumn.minWidth === null ? 0 : currColumn.minWidth;
        if (currColumnWidth + diff < minWidth) {
            diff = -(currColumnWidth - minWidth);
        }

        // --------

        if (!this.resize.nextColumn) {
            if (this.resize.maxDiffLastColumn > diff) {
                diff = this.resize.maxDiffLastColumn;
            }
        }

        // --------

        if (nextColumn) {
            let diffCCol;

            minWidth = nextColumn.minWidth === null ? 0 : nextColumn.minWidth;
            if (nextColumnWidth - diff < minWidth) {
                diffCCol = nextColumnWidth - minWidth;
                diff -= diffCCol;
            } else {
                diffCCol = diff;
                diff = 0;
            }

            newCurrColumnWidth = currColumnWidth + diffCCol;
            newNextColumnWidth = nextColumnWidth - diffCCol;

            if (currColumn.flex !== null) {
                currColumn.flex = newCurrColumnWidth * flexInfo.flex / flexInfo.width;
            }

            if (currColumn.width !== null) {
                currColumn.width = newCurrColumnWidth;
            }

            if (nextColumn.flex !== null) {
                nextColumn.flex = newNextColumnWidth * flexInfo.flex / flexInfo.width;
            }

            if (nextColumn.width !== null) {
                nextColumn.width = newNextColumnWidth;
            }
        }

        if (diff !== 0) {
            newCurrColumnWidth += diff;

            if (currColumn.flex !== null) {
                currColumn.flex = newCurrColumnWidth * flexInfo.flex / flexInfo.width;
            }

            if (currColumn.width !== null) {
                currColumn.width = newCurrColumnWidth;
            }

            this.resize.info.forEach((info) => {
                info.column.width = info.column.flex * flexInfo.width / flexInfo.flex;
            });
        }

        this.grid.refreshColSize();
    }

    // -----------------------------------------

    public createVerticalLine(): void {
        let div: HTMLDivElement = methodCall(this.grid, "ref", [Grid.REFS.GRID]);

        this.line = document.createElement("div");
        this.line.setAttribute("class", "ngrid-head-resize-line");

        div.appendChild(this.line);
    }

    public cleanVerticalLine(): void {
        this.line = null;
        this.showLine = false;
    }

    public showVerticalLine(): void {
        if (!this.showLine) {
            this.showLine = true;
            this.line.style.display = "block";
        }
    }

    public hideVerticalLine(): void {
        if (this.showLine) {
            this.showLine = false;
            this.line.style.display = "none";
        }
    }

    protected mount(): void {
        let head: HeadGrid<T> = this.grid.getHead();
        let div: HTMLDivElement = methodCall(head, "ref", [HeadGrid.REFS.HEAD]);

        this.createVerticalLine();
        event.on(div, this.events);
    }

    protected unmount(): void {
        this.cleanVerticalLine();
        event.off(div, this.events);
    }
}
