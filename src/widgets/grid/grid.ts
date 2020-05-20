
import { Component, template, IComponentProps, methodCall, IHashMapBoolean } from "core";
import { IHashMap, IHashMapAny } from "core";

import { HeadGrid, IColumn, IHeadProps } from "./headgrid/headgrid";
import { ViewGrid, IViewProps } from "./viewgrid/viewgrid";
import { IPluginConstructor, IRegisterPlugin, IPlugin, IPluginProps } from "./plugins/Plugin";
import { isNumber } from "./../utils/util";

export interface IGridProps<T> extends IComponentProps {
    columns?: IColumn<T>[];
    data?: T[] | T;
    plugins?: IPluginProps[];
    hideHead?: boolean;

    width?: number;
    height?: number;

    getId?: (item: T) => any;     // получает id зааписи

    multiSelect?: boolean;
    emptyRowText?: string;

    bufferEnable?: boolean;
    bufferHeight?: number;
    bufferStock?: number;
    bufferScrollMin?: number;
}

export interface IPluginItem {
    type: string;
    plugin: IPlugin;
}

@template({
    html: "",
    root: {
        tagName: "div",
        ref: "grid",
        cl: {
            ngrid: true
        }
    }
})
export class Grid<
        T extends IHashMapAny = IHashMapAny,
        P extends IGridProps<T> = IGridProps<T>
    > extends Component<P> {

    public static plugins: IHashMap<IRegisterPlugin<any>> = {};
    public static registerPlugin(plugin: IRegisterPlugin<any>): void {
        this.plugins[plugin.type] = plugin;
    }

    /* tslint:disable:member-ordering */
    public static REFS = {
        GRID: "grid"
    };
    /* tslint:enable:member-ordering */

    protected head: HeadGrid<T, IHeadProps<T>, Grid<T>>; // шапка таблицы
    protected view: ViewGrid<T, IViewProps<T>, Grid<T>>; // контент таблицы

    protected plugins: IPluginItem[];

    // получает экземпляр класса заголовка
    public getHead(): HeadGrid<T> {
        return this.head;
    }

    // получает экземпляр класса контента
    public getView(): ViewGrid<T> {
        return this.view;
    }

    // показывает шапку таблицы
    public showHead(): void {
        this.cl(Grid.REFS.GRID, { "head-hidden": false });
        this.props.hideHead = false;
    }

    // скрывает шапку таблицы
    public hideHead(): void {
        this.cl(Grid.REFS.GRID, { "head-hidden": true });
        this.props.hideHead = true;
    }

    // ищет колонки
    public findColumns(fn: (column: IColumn<T>) => boolean): IColumn<T>[] {
        return this.head.findColumns(fn);
    }

    // ищет колонку
    public findColumn(fn: (column: IColumn<T>) => boolean): IColumn<T> {
        return this.head.findColumn(fn);
    }

    // получает список колонок
    public getColumns(): IColumn<T>[] {
        return this.props.columns;
    }

    public getPlugin(type: string): IPlugin {
        let plugins: IPluginItem[] = this.plugins.filter((plugin: IPluginItem) => plugin.type === type);
        if (plugins.length > 0) {
            return plugins[0].plugin;
        }

        return null;
    }

    // загружает данные в таблицу
    public loadData(data: T[] | T): void {
        if (!Array.isArray(data)) {
            data = Object.prototype.toString.call(data) === "[object Object]" ? [data] : [];
        }

        this.view.loadData(data as T[]);
    }

    // получает все данные
    public getData(): T[] {
        return this.view.getData();
    }

    // получает модель данных по id
    public getRowById(id: any): T {
        return this.view.getRowById(id);
    }

    // формирует шапку у таблицы
    public reconfigure(columns: IColumn<T, Grid<T>>[]): void {
        this.head.reconfigure(columns);
    }

    // обновляет ширину у каждого столбца
    public refreshColSize(): void {
        this.head.refreshColSize();
    }

    // возвращает список выбранных строк
    public getSelected(): T[] {
        return this.view.getSelected();
    }

    // устанавливает выделенные строки
    public doSelect(data: T | T[]): void {
        this.view.doSelect(data);
    }

    // устанавливает скролл на указанную позицию
    public scrollTo(scrollTop?: number, scrollLeft?: number): void {
        this.view.scrollTo(scrollTop, scrollLeft);
    }

    // скроллит таблицу до указанной записи
    public scrollBy(data: T, isTop: boolean = true): void {
        this.view.scrollBy(data, isTop);
    }

    // устанавливает ширину в таблице
    public setWidth(width: number): void {
        this.props.width = width;
        this.css(Grid.REFS.GRID, { width: width === null ? null : `${width}px` });
    }

    // устанавливает высоту в таблице
    public setHeight(height: number): void {
        this.props.height = height;
        this.css(Grid.REFS.GRID, { height: height === null ? null : `${height}px` });
    }

    public setCl(cl: IHashMapBoolean): void {
        this.cl(Grid.REFS.GRID, cl);
    }

    // устанавливает чек в таблице
    public setCheck(data: T, checked: boolean): void {
        (data as any).checked = checked; // TODO

        this.emit("checkchange", data, checked);
    }

    // обновляет таблицу
    public refresh(): void {
        this.view.refresh();
    }

    // находит record по NODE узлу
    public getRecordByEl(el: HTMLElement): T {
        return this.view.getRecordByEl(el);
    }

    // находит column по NODE узлу
    public getHeaderByEl(el: HTMLElement): IColumn<T> {
        return this.head.getHeaderByEl(el);
    }

    // обновляет строку у таблицы по записи
    public updateRowByData(data: T): void {
        this.view.updateRowByData(data);
    }

    // обновляет строку у таблицы по id
    public updateRowById(idRow: any): void {
        this.view.updateRowById(idRow);
    }

    // ----------------------------------------------------

    // перед инициализацией. здесь мы устанавливаем значения по умолчанию
    // если их не передали в параметрах, при создании компонента
    protected beforeInit(): void {

        if (!this.props.getId) {
            this.props.getId = (item: any) => item.id;
        }

        // добавляем события

        function cellMouseDown_Grid(
            grid: Grid<T>,
            td: HTMLTableCellElement,
            columnIndex: number,
            data: T,
            tr: HTMLTableRowElement,
            rowIndex: number,
            event: MouseEvent,
            column: IColumn<T, Grid<T>>
        ) {
            if (column.xtype === "checkcolumn") {
                let dataIndex: string = column.dataIndex || "checked";
                let model: any = this.props.getData(data);
                let checked: boolean = model[dataIndex];

                grid.setCheck(data, !checked);
            } else {
                grid.view.doSelect([data], event.ctrlKey);
            }
        }

        this.on("onCellMouseDown", cellMouseDown_Grid);
    }

    // после инициализации. создаем дочерние компоненты
    protected afterInit(): void {
        this.setWidth(isNumber(this.props.width) ? this.props.width : null);
        this.setHeight(isNumber(this.props.height) ? this.props.height : null);

        this.initHead();
        this.initView();

        if (this.props.hideHead) {
            this.hideHead();
        }

        // добавим шапку таблицы для синхронизации с контентом
        // т.к. шапка и контент это два разных тега <table>
        // им нужно задавать одинаковые ширины колонок,
        // для этого и нужна синхронизация
        this.view.addSyncTable(this.head);

        this.initPlugins();

        this.loadData(this.props.data);
    }

    // перед рендерингом. говорим какие дочерние компоненты должны рендериться
    protected beforeMount(): void {
        this.head.appendChild(this.ref(Grid.REFS.GRID));
        this.view.appendChild(this.ref(Grid.REFS.GRID));

        this.mountPlugins();
    }

    // после рендеринга. стартуем обновлять нашу таблицу
    protected afterMount(): void {
        this.head.reconfigure(this.props.columns);
        this.view.asyncUpdateSize();
    }

    protected beforeUnmount(): void {
        this.unmountPlugins();

        this.head.remove();
        this.view.remove();

        this.head = null;
        this.view = null;
    }

    protected initHead(): void {
        this.head = new HeadGrid<T, IHeadProps<T>, Grid<T>>({
            columns: this.props.columns
        }, this);
    }

    protected initView(): void {
        this.view = new ViewGrid<T, IViewProps<T>, Grid<T>>({
            data: this.props.data,
            getId: this.props.getId,

            columns: [],

            multiSelect: this.props.multiSelect,
            emptyRowText: this.props.emptyRowText,

            bufferEnable: this.props.bufferEnable,
            bufferHeight: this.props.bufferHeight,
            bufferStock: this.props.bufferStock,
            bufferScrollMin: this.props.bufferScrollMin
        }, this);
    }

    // --- плагины

    // инициализация плагинов
    private initPlugins(): void {
        this.plugins = (this.props.plugins || []).map((pluginProps: IPluginProps) => {
            let plugin: IPlugin = null;

            if (Grid.plugins.hasOwnProperty(pluginProps.type)) {
                let Ctor: IPluginConstructor<T> = Grid.plugins[pluginProps.type].plugin;

                try {
                    plugin = new Ctor(pluginProps, this);
                } catch (e) {
                    console.error(e);
                }
            }

            return { type: pluginProps.type, plugin };
        });
    }

    // рендеринг плагинов
    private mountPlugins(): void {
        this.plugins.forEach((pluginItem: IPluginItem) => {
            let plugin: IPlugin = pluginItem.plugin;
            let MOUNT: string = "mount";

            if (plugin && plugin[MOUNT]) {
                methodCall(pluginItem.plugin, MOUNT, []);
            }
        });
    }

    // демонтирование плагинов
    private unmountPlugins(): void {
        this.plugins.forEach((pluginItem: IPluginItem) => {
            let plugin: IPlugin = pluginItem.plugin;
            let UNMOUNT: string = "unmount";

            if (plugin && plugin[UNMOUNT]) {
                methodCall(pluginItem.plugin, UNMOUNT, []);
            }
        });
    }
}
