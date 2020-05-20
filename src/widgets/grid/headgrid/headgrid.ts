
import { Component, template, IComponentProps, on, IHashMapBoolean } from "core";
import { dom, IDom, methodCall } from "core";
import { IHashMap, IHashMapAny } from "core";
import { Grid } from "./../grid";
import { ViewGrid, IMeta } from "./../viewgrid/viewgrid";
import { isNumber, findParentNode } from "./../../utils/util";
import { ICONS, createIcon } from "./../../icons";

// параметры которые можно передавать внутрь компонента
export interface IHeadProps<T, R extends Grid<T> = Grid<T>> extends IComponentProps {
    columns: IColumn<T, R>[];  // список колонок в таблице
}

// функция renderer в колонке IColumn
export type Render<T, R extends Grid<T> = Grid<T>> = (value: any, meta: IMeta<T, R>, data: T) => string;

// парамерты колонки
export interface IColumn<T, R extends Grid<T> = Grid<T>> {
    id?: number;               // private !!!
    xtype?: string;            // тип колонки (basecolumn)
    text?: string;             // надпись в колонке ('')
    width?: number;            // ширина колонки (100)
    minWidth?: number;         // минимальная ширина колонки (0)
    flex?: number;             // ширина колонки в пропорции. если задан flex, то параметр width игнорируется (null)
    cls?: string;              // класс который будет добавлен в колонку
    tdCls?: IHashMapBoolean;   // класс, который будет добавлен в ячейку данных ('')
    align?: string;            // форматирование (отображать: слева, справа, по центру) (null - 'left')
    accuracyClick?: boolean;   // точный клик по ячейке, будет проигнорировано событие click и dblclick,
                               // если координаты по событиям MouseDown и Click не совпадают (false)
    dataIndex?: string;        // ключ, для быстрого доступа к данным (null)
    renderer?: Render<T, R>;   // функция для рендера ячейки (null)
    columns?: IColumn<T, R>[]; // дочерние колонки (для многоуровневой шапки) (null)
    resizable?: boolean;       // возможность изменять ширину колонки (false)
    sortable?: boolean;        // возможность сортировать колонку (false)
    direction?: Direction;     // направление сортировки в таблице (null)
    tooltip?: string;          // тултип для колонки
    [propName: string]: any;   // другие произвольные параметры, которые можно записать в колонку
}

// направление сортировки
type Direction = "ASC" | "DESC";

// -------------------------------------------
// интерфейсы для внутренней работы компонента

// функция рендера
type FnRender<T, R extends Grid<T>> = (data: T, meta: IMeta<T, R>) => string;
interface IColumnType<T, R extends Grid<T>> {
    xtype: string;             // тип колонки
    renderer: FnRender<T, R>;  // функция рендера для этого типа колонки
}

@template({
    html: require("./headgrid.html"),
    root: {
        tagName: "div",
        ref: "head",
        cl: {
            "ngrid-head": true
        }
    }
})
export class HeadGrid<
        T extends IHashMapAny = IHashMapAny,
        P extends IHeadProps<T> = IHeadProps<T>,
        R extends Grid<T> = Grid<T>
    > extends Component<P, R> {

    public static columnId: number = 1000;

    public static columns: IHashMap<IColumnType<IHashMapAny, Grid<IHashMapAny>>> = {};
    public static registerColumn(column: IColumnType<IHashMapAny, Grid<IHashMapAny>>): void {
        this.columns[column.xtype] = column;
    }

    /* tslint:disable:member-ordering */
    public static REFS = {
        HEAD: "head",
        CONTENT: "content",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };
    /* tslint:enable:member-ordering */

    private headerDom: IDom;
    private colsDom: IDom;

    private columnsDown: IColumn<T, R>[];
    private useFlexColumns: boolean;

    public beforeInit(): void {
        this.useFlexColumns = false;
        this.colsDom = null;

        this.columnsDown = [];
        this.headerDom = {
            name: "tbody",
            children: []
        };
    }

    // ищет колонки
    public findColumns(fn: (column: IColumn<T, R>) => boolean): IColumn<T, R>[] {
        let result: IColumn<T, R>[] = [];

        let columns: IColumn<T, R>[] = this.props.columns as IColumn<T, R>[];
        this.eachColumn(columns, (column: IColumn<T, R>) => {
            if (fn(column)) {
                result.push(column);
            }
        });

        return result;
    }

    // ищет колонку
    public findColumn(fn: (column: IColumn<T, R>) => boolean): IColumn<T, R> {
        return this.findColumns(fn)[0] || null;
    }

    // делает сортировку по колонке. пока не реализовано :(
    public sortByColumn(column: IColumn<T, R>, direction?: Direction): void {
        /*if (column.sortable) {
            // список колонок, которые можем сотрировать
            let columns = this.headerNodesDown.map((nodeTd) => {
                return nodeTd.tplData.column;
            });

            // сбрасываем сортировку у других колонок
            columns.forEach((c) => {
                if (c.id !== column.id) {
                    c.direction = null;
                }
            });

            // если указано явное направление сортировки, то выставляем ее
            // иначе делаем инверсию относительно этой же колонки
            if (direction) {
                column.direction = direction;
            } else {
                column.direction = column.direction === 'ASC' ? 'DESC' : 'ASC';
            }

            let grid = this.ownerCt;

            if (column.valueSort) {
                grid.getStore().sort({
                    fn (record1, record2) {
                        let v1 = column.valueSort.call(grid, record1, column);
                        let v2 = column.valueSort.call(grid, record2, column);

                        if (v1 === v2) {
                            return 0;
                        }

                        return v1 > v2 ? 1 : -1;
                    },
                    direction: column.direction
                });
            } else {
                if (column.dataIndex) {
                    grid.getStore().sort({
                        property: column.dataIndex,
                        direction: column.direction
                    });
                }
            }

            this.updateHeader();
            grid.fireEvent('sortchange', grid, column, column.direction);
        }*/
    }

    // изменяет шапку у таблицы
    public reconfigure(columns: IColumn<T, R>[]): void {
        this.initColumns(columns || []);

        if (this.isRendered()) {
            this.updateHeader();
            this.refreshColSize();
        }
    }

    // обновляет ширину у каждого столбца
    public refreshColSize(): void {
        let grid: Grid<T> = this.parent;
        let view: ViewGrid<T> = grid.getView();
        // - когда таблица не была прорендерена;
        // - когда талица скрыта "display: none";
        // - когда колонок в таблице нет;
        // обновлять ничего не будем
        if (!this.isRendered() || !view.getWidth() || this.columnsDown.length === 0) {
            return;
        }

        let { useFlex, colsDom } = this.getColsDom();
        let syncTableList: Component<any>[] = view.getSyncTableList();
        let updateList: Component<any>[] = ([view] as Component<any>[]).concat(syncTableList);
        let ref: string = ViewGrid.REFS.COLS;
        let defaultColsDom: IDom = {
            name: "colgroup",
            children: []
        };

        updateList.forEach((component: Component<any>) => {
            let colgroup: HTMLElement = methodCall(component, "ref", [ref]);
            let cols: IDom = colgroup.children.length > 0 ? this.colsDom : defaultColsDom;

            if (colgroup) {
                dom.update(colgroup, cols, colsDom);
            }
        });

        this.useFlexColumns = useFlex;
        this.colsDom = colsDom;

        view.refresh();
    }

    // находит column по NODE узлу
    public getHeaderByEl(el: HTMLElement): IColumn<T, R> {
        let div: HTMLDivElement = this.ref(HeadGrid.REFS.HEAD) as HTMLDivElement;
        let nodeTd: HTMLTableDataCellElement = findParentNode(el, "td", div) as HTMLTableDataCellElement;

        if (nodeTd) {
            let index: number = parseInt(nodeTd.getAttribute("data-index"), 10);
            return this.columnsDown[index];
        }

        return null;
    }

    public getTdByEl(el: HTMLElement): HTMLTableDataCellElement {
        return findParentNode(el, "td", this.ref(HeadGrid.REFS.HEAD)) as HTMLTableDataCellElement;
    }

    public getColumnByTd(td: HTMLTableDataCellElement, goDown?: boolean): IColumn<T, R> {
        if (td) {
            // находим id колонки по которой кликнули
            let columnId: number = parseInt(td.getAttribute("data-num"), 10);
            // находим колонку по которой кликнули
            let column: IColumn<T, R> = this.findColumn((c) => c.id === columnId);

            if (column) {
                if (goDown) {
                    while (column.columns && column.columns.length > 0) {
                        column = column.columns[column.columns.length - 1];
                    }
                }

                return column;
            }
        }

        return null;
    }

    // возвращает нижний ряд с колонками
    public getColumnsDown(): IColumn<T, R>[] {
        return this.columnsDown;
    }

    public isUseFlex(): boolean {
        return this.useFlexColumns;
    }

    // --------------------------------------------------------
    // приватные методы для работы с заголовком таблицы

    // инициализация колонок
    private initColumns(columns: IColumn<T, R>[]): void {
        this.columnsDown = [];

        this.eachColumn(columns, (column) => {
            // у каждой колонки должден быть тип,
            // по этому типу будет производиться рендеринг данных
            // если тип не задан, то устанавливаем по умолчанию
            if (!column.xtype) { column.xtype = "basecolumn"; }
            if (!isNumber(column.id)) { column.id = ++HeadGrid.columnId; }
            if (!column.text) { column.text = ""; }
            if (!column.tdCls) { column.tdCls = null; }
            if (!column.align) { column.align = null; }
            if (!column.dataIndex) { column.dataIndex = null; }
            if (!column.renderer) { column.renderer = null; }
            if (!column.columns) { column.columns = null; }
            if (!column.tooltip) { column.tooltip = null; }
            if (!column.accuracyClick) { column.accuracyClick = false; }

            if (column.columns) {
                column.resizable = false;
                column.sortable = false;
                column.minWidth = null;
                column.width = null;
                column.flex = null;
            } else {
                column.resizable = column.resizable !== false;
                column.sortable = column.sortable !== false;
                column.minWidth = column.minWidth ? column.minWidth : null;

                if (isNumber(column.flex)) {
                    column.width = null;
                } else {
                    column.flex = null;

                    if (!isNumber(column.width)) {
                        column.width = 100;
                    }
                }

                // соберем нижний ряд колонок (если это многоуровневая шапка)
                this.columnsDown.push(column);
            }
        });

        this.props.columns = columns;
        this.parent.props.columns = columns;
    }

    // обновляет шапку таблицы
    private updateHeader(): void {
        let view: ViewGrid<T> = this.parent.getView();
        let headerDomDown: IDom[] = [];
        let headerDom: IDom = {
            name: "tbody",
            children: []
        };

        this.createHeaderDom(headerDom, headerDomDown, this.props.columns, 0);
        this.updateRowspan(headerDomDown, headerDom.children.length);

        dom.update(this.ref(HeadGrid.REFS.BODY), this.headerDom, headerDom);

        this.headerDom = headerDom;

        // обновим колонки во вьюхе
        view.props.columns = headerDomDown.map((d: IDom) => d.column);
    }

    // создает виртуальный DOM для колонок
    private createHeaderDom(headerDom: IDom, headerDomDown: IDom[], columns: IColumn<T, R>[], depth: number): number {
        if (headerDom.children.length === depth) {
            headerDom.children.push({
                name: "tr",
                id: depth,
                children: []
            });
        }

        let domTr: IDom = headerDom.children[depth];
        let totalChildren: number = 0;

        columns.forEach((column: IColumn<T, R>) => {
            let sortIcon: string = "";

            if (column.direction) {
                let direction: string = column.direction.toLowerCase();
                sortIcon = createIcon(ICONS.HEADER_ARROW, `sort ${direction}`);
            }

            let domTd: IDom = {
                name: "td",
                id: column.id,
                text: column.text + sortIcon,
                attr: { },
                cl: { },
                depth,
                column
            };

            domTd.attr["data-num"] = column.id.toString();

            if (column.tooltip) {
                domTd.attr["data-qtip"] = column.tooltip;
            }

            if (column.cls) {
                domTd.cl[column.cls] = true;
            }

            domTr.children.push(domTd);

            let countChildren: number = 0;
            if (column.columns) {
                countChildren = this.createHeaderDom(headerDom, headerDomDown, column.columns, depth + 1);
            } else {
                countChildren = 1;

                // конечный узел колонки
                headerDomDown.push(domTd);
            }

            if (countChildren > 1) {
                domTd.attr.colspan = countChildren.toString();
            }

            totalChildren += countChildren;
        });

        return totalChildren;
    }

    // обновляет атрибуты rowspan
    private updateRowspan(headerDomDown: IDom[], maxDepth: number): void {
        headerDomDown.forEach((domTd: IDom) => {
            let rowspan: number = maxDepth - domTd.depth;

            if (rowspan > 1) {
                domTd.attr.rowspan = rowspan.toString();
            }
        });
    }

    // вычисляет ширину каждой колонки
    // возвращает информацию:
    // useFlex - используется хотябы в одной колонке flex
    // list - список ширин для каждой колонки
    private getColsDom(): { useFlex: boolean, colsDom: IDom } {
        // view
        let view: ViewGrid<T> =  this.parent.getView();
        let container: HTMLDivElement = methodCall(view, "ref", [ViewGrid.REFS.CONTAINER]);
        // ширина контента
        let contentWidth: number = container.getBoundingClientRect().width;

        // сгенерим упрощенную модель списка колонок.
        // минимальная ширина, ширина и флекс
        // value будем вычислять. это и будет ширина нашей колонки
        let cutColumns: IColumn<T, R>[] = this.columnsDown.map((column) => {
            return {
                minWidth: column.minWidth,
                width: column.width,
                flex: column.flex,
                value: null
            };
        });

        let useFlex: boolean = this.updateCutColumns(cutColumns, contentWidth);
        let colsDom: IDom[] = cutColumns.map((cutColumn: IColumn<T, R>, index: number) => {
            return {
                id: index,
                name: "col",
                attr: {
                    width: cutColumn.value
                }
            };
        });

        return {
            useFlex,
            colsDom: {
                name: "colgroup",
                children: colsDom
            }
        };
    }

    // находит ширину для каждой колонки и возвращает
    // используется ли flex хотябы в одной колонке
    private updateCutColumns(columns: IColumn<T, R>[], contentWidth: number): boolean {
        let staticWidth: number = 0; // сумма всех колонок с фиксированной шириной
        let flexWidth: number;       // ширина контента для флекса
        let flexSum: number = 0;     // сумма всех колонок с флексом
        let column: IColumn<T, R>;   // колонка

        let minWidth: number;        // минимальная ширина колонки
        let percent: number;         // процент на который будем растягивать колонку

        columns.forEach((c: IColumn<T, R>) => {
            if (c.flex === null) {
                staticWidth += c.width;
            } else {
                flexSum += c.flex;
            }
        });

        // вычитаем всю доступную нам ширину и статическую
        // получаем ширину которая доступна нам для флекса
        flexWidth = contentWidth - staticWidth;

        // перебираем каждую колонку и находим value
        let ln: number = columns.length;
        for (let i = 0; i < ln; ++i) {
            column = columns[i];

            if (column.flex === null) {
                // если у колонки не задан flex, то это колонка является статической
                // просто запишем в value значение статики
                column.value = `${column.width}`;
            } else {
                // колонка является флексовой. найдем ее минимально допустимое значение
                // оно может хранится и в width и в minWidth
                minWidth = column.width === null ? (column.minWidth === null ? null : column.minWidth) : column.width;
                // найдем у флекса процентное соотношение.
                // это значение флекса данной колонки и сумма всех флексов
                percent = column.flex / flexSum;

                // если минимальная ширина найдена И!
                // размер колонки меньше чем минимальное значение
                // то установим этой колонке минимальную ширину и
                // запустим перерасчет снова
                if (minWidth !== null && minWidth > percent * flexWidth) {
                    column.width = minWidth;
                    column.flex = null;

                    return this.updateCutColumns(columns, contentWidth);
                } else {
                    // если минимальной ширины нет или она есть, но
                    // ширина колонки больше чем ее минимум
                    // то все ок. запишем ее процентное соотношение
                    column.value = `${percent * 100}%`;
                }
            }
        }

        return flexSum > 0;
    }

    // перебирает каждую колонку
    private eachColumn(columns: IColumn<T, R>[], fn: (column: IColumn<T, R>) => void): void {
        columns.forEach((column) => {
            fn(column);

            if (column.columns) {
                this.eachColumn(column.columns, fn);
            }
        });
    }

    @on(HeadGrid.REFS.HEAD, "click")
    private onHeaderClick(event: MouseEvent): void {
        // console.log(111);
        /*let td: HTMLTableDataCellElement = this.getTdByEl(event.target as HTMLElement);
        let column: IColumn<T, R> = this.getColumnByTd(td);

        if (column /*&& !this.findResizableColumn(td, event)* /) {
            this.sortByColumn(column);

            this.parent.emit("onHeaderClick", column, event);
        }*/
    }

}

// регистрируем типы колонок

HeadGrid.registerColumn({
    xtype: "basecolumn",
    renderer<T, R extends Grid<T>>(data: T, meta: IMeta<T, R>): string {
        let value: string = data[meta.column.dataIndex];

        if (meta.column.renderer) {
            return meta.column.renderer(value, meta, data);
        }

        return value;
    }
});

HeadGrid.registerColumn({
    xtype: "rownumberer",
    renderer<T, R extends Grid<T>>(data: T, meta: IMeta<T, R>): string {
        let value: string = (meta.row.index + 1).toString();

        if (meta.column.renderer) {
            return meta.column.renderer(value, meta, data);
        }

        return value;
    }
});

HeadGrid.registerColumn({
    xtype: "checkcolumn",
    renderer<T, R extends Grid<T>>(data: T, meta: IMeta<T, R>): string {
        let dataIndex: string = meta.column.dataIndex || "checked";
        let checked: boolean = data[dataIndex];

        let checkIcon: string = createIcon(checked ? ICONS.CHECKBOX_CHECKED : ICONS.CHECKBOX);

        meta.cl.checkcolumn = true;
        meta.cl["row-center"] = true;

        if (meta.column.renderer) {
            return meta.column.renderer(checkIcon, meta, data);
        }

        return checkIcon;
    }
});
