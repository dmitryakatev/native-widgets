
/* !!! ПЕРЕПИСАТЬ !!! */

import { event, IHashMap } from "core";
import { Grid } from "./../../grid";
import { IColumn } from "./../../headgrid/headgrid";
import { ViewGrid, IRow } from "../../viewgrid/viewgrid";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";
import { ICONS, createIcon } from "./../../../icons";
import { correctionCoordinate, ICoord, ISize } from "./../../../utils/util";
import { reedProperty, getDecl } from "./../../../utils/util";

let container: HTMLDivElement = null;

export class DragDropPlugin<T> implements IPlugin {

    private grid: Grid<T>;
    private selected: T[];

    private allowDrop: boolean;
    private activeIdRow: any;

    private windowEvents: IHashMap<(event: MouseEvent) => void>;

    constructor(props: IPluginProps, grid: Grid<T>) {
        this.grid = grid;
        this.selected = null;
        this.windowEvents = {
            mouseup: (e: MouseEvent) => {
                this.onDoneDragDrop(e);
            },
            mousemove: (e: MouseEvent) => {
                this.updateCoordinate(e);
            }
        };

        let plugin: DragDropPlugin<T> = this;

        function cellMouseDown_Grid(
            gr: Grid<T>,
            td: HTMLTableCellElement,
            columnIndex: number,
            data: T,
            tr: HTMLTableRowElement,
            rowIndex: number,
            e: MouseEvent,
            column: IColumn<T>
        ): void {
            plugin.onStartDrag(e, tr);
        }

        function cellMouseMove_Grid(
            gr: Grid<T>,
            td: HTMLTableCellElement,
            columnIndex: number,
            data: T,
            tr: HTMLTableRowElement,
            rowIndex: number,
            e: MouseEvent,
            column: IColumn<T>
        ): void {
            if (plugin.selected !== null) {
                plugin.onUpdateDrag(e, tr, data);
            }
        }

        this.grid.on("onCellMouseDown", cellMouseDown_Grid);
        this.grid.on("onCellMouseMove", cellMouseMove_Grid);
    }

    protected checkDrop(data: T, percent: number): boolean {
        let idRow: any = this.grid.props.getId(data);

        return !this.selected.some((item: T) => {
            return this.grid.props.getId(item) === idRow;
        });
    }

    protected updateActivityRow(idRow: any, show: boolean): void {
        let view: ViewGrid<T> = this.grid.getView();
        let hash: IHashMap<any> = reedProperty(view, "renderedHash");
        let list: IRow<T> = reedProperty(view, "renderedList");
        let cls: string = "ngrid-drag-drop-active-row";

        if (hash.hasOwnProperty(idRow)) {
            let row: IRow<T> = list[hash[idRow]];

            if (show) {
                row.node.classList.add(cls);
            } else {
                row.node.classList.remove(cls);
            }
        }
    }

    protected update(data: T, percent: number): void {
        let view: ViewGrid<T> = this.grid.getView();
        let allowDrop: boolean = this.checkDrop(data, percent);
        let idRow: any;
        let index: number;

        if (allowDrop) {
            if (percent < 0.5) {
                idRow = view.props.getId(data);
                index = reedProperty(view, "dataHash")[idRow];

                if (index === 0) {
                    data = null;
                    idRow = null;
                } else {
                    data = reedProperty(view, "dataList")[index - 1];
                    idRow = view.props.getId(data);
                }
            }

            if (this.activeIdRow !== idRow) {
                if (this.grid.emit("onChangeTargetDrop", data) === false) {
                    allowDrop = false;
                }
            }
        } else {
            this.activeIdRow = null;
        }

        if (this.activeIdRow !== idRow) {
            this.updateActivityRow(this.activeIdRow, false);
            this.updateActivityRow(idRow, true);

            this.updateTooltip(allowDrop);

            this.activeIdRow = idRow;
        }
    }

    private onStartDrag(e: MouseEvent, tr: HTMLTableRowElement): void {
        if (container === null) {
            this.initTooltip();
        } else {
            this.showTooltip();
        }

        this.selected = this.grid.getSelected();
        event.on(window as any, this.windowEvents);
        this.grid.setCl({ "ngrid-drag-drop": true });
    }

    private onUpdateDrag(e: MouseEvent, tr: HTMLTableRowElement, data: T): void {
        let bound: ClientRect = tr.getBoundingClientRect();
        let full: number = bound.bottom - bound.top;
        let value: number = e.clientY - bound.top;
        let percent: number = value / full;

        this.update(data, percent);
    }

    private onDoneDragDrop(e: MouseEvent): void {
        this.selected = null;
        event.off(window as any, this.windowEvents);
        this.grid.setCl({ "ngrid-drag-drop": false });

        this.hideTooltip();
    }

    // ---------------------------------------------

    private initTooltip(): void {
        container = document.createElement("div");
        document.body.appendChild(container);
        container.setAttribute("class", "ngrid-drag-drop-tooltip");
    }

    private showTooltip(): void {
        container.style.display = "block";
    }

    private hideTooltip(): void {
        container.style.display = "none";
    }

    private updateCoordinate(e: MouseEvent): void {
        let bound: ClientRect = container.getBoundingClientRect();
        let coord: ICoord = { x: e.clientX, y: e.clientY };
        let size: ISize = { width: bound.width, height: bound.height };

        coord = correctionCoordinate(coord, size);

        container.style.top = `${coord.y}px`;
        container.style.left = `${coord.x}px`;
    }

    private updateTooltip(allowDrop: boolean): void {
        if (this.allowDrop !== allowDrop) {
            this.allowDrop = allowDrop;

            let iconId: string = allowDrop ? ICONS.DRAG_DROP_OK : ICONS.DRAG_DROP_LOCK;
            let icon: string = createIcon(iconId, "ngrid-drag-drop-icon");
            let count: number = this.selected.length;
            let texts: string[] = [
                `Выбрана ${count} запись`,
                `Выбрано ${count} записи`,
                `Выбрано ${count} записей`
            ];

            container.innerHTML = icon + getDecl(texts, count);
        }
    }
}
