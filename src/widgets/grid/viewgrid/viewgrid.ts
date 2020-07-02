
import { Component, template, IComponentProps } from "core";
import { on, IRef, event, merge } from "core";
import { dom, IDom } from "core";
import { IHashMap, IHashMapString, IHashMapBoolean, IHashMapAny } from "core";
import { Grid } from "./../grid";
import { HeadGrid, IColumn } from "../headgrid/headgrid";
import { arrayToObject, findParentNode, isNumber } from "./../../utils/util";
import { injectScrollbarInfo, getScrollbarSize } from "./../../utils/util";

// параметры которые можно передавать внутрь компонента
export interface IViewProps<T, R extends Grid<T> = Grid<T>> extends IComponentProps {
    columns?: IColumn<T, R>[];    // нижний ряд колонок (если колонки многоуровневые)

    multiSelect?: boolean;        // возможность множественного выбора
    emptyRowText?: string;        // текст для отображения когда данных в таблице нет
    data?: T[] | T;               // массив данных
    getId?: (item: T) => any;     // получает id зааписи

    bufferEnable?: boolean;       // включить рендеринг только видимой части таблицы
    bufferHeight?: number;        // высота строрки
    bufferStock?: number;         // сколько строк рендерить за пределами видимости (запас)
    bufferScrollMin?: number;     // сколько пикселей при скролле игнорировать ререндер таблицы
}

// информация о строке таблицы
export interface IRow<T> {
    idRow: any;                   // id строки
    data: T;                      // данные строки
    selected: boolean;            // является ли строка выделенной ??? (нужно ли это)
    index: number;                // индекс строки
    dataCells: IDom;              // данные строки
    node: HTMLTableRowElement;    // ссылка на DOM узел (td)
}

// метаданные при рендере ячеек в строке
export interface IMeta<T, R extends Grid<T> = Grid<T>> {
    view: Grid<T>;                // ссылка на Grid компонент
    row: IRow<T>;                 // ссылка на IRow
    column: IColumn<T, R>;        // ссылка на Column
    data: T;                      // модель данных для строки
    attr: IHashMapString;         // атрибуты, которые можно добавить для td DOM узла
    cl: IHashMapBoolean;          // классы, которые можно добавить для td DOM узла
    css: IHashMapString;          // стили, которые можно добавить для td DOM узла
    [propName: string]: any;      // другие произвольные параметры, которые можно записать в Meta
}

// контекст вызова рендера
export interface IContext<T> {
    renderedList: IRow<T>[];        // список строк которые были прорендерены (массив)
    renderedHash: IHashMap<number>; // список строк которые были прорендерены (ключ->значение)
}

// диапазон с какой и по какую строки нужно рендерить
export interface IRange {
    start: number;                // с какой позиции нужно рендерить строки
    finish: number;               // по какую позицию нужно рендерить строки
}

// информация о строке
export interface IVisibleInfo extends IRange {
    shiftTop: number;             // сдвиг сверху
    shiftBottom: number;          // сдвиг снизу
    index: number;                // информация по номеру по порядку строки (индексу)
    inRange: boolean;             // является ли строка в видимой области видимости
}

@template({
    html: require("./viewgrid.html"),
    root: {
        tagName: "div",
        ref: "data",
        cl: {
            "ngrid-data": true
        }
    }
})
export class ViewGrid<
        T extends IHashMapAny = IHashMapAny,
        P extends IViewProps<T> = IViewProps<T>,
        R extends Grid<T> = Grid<T>
    > extends Component<P, R> {

    public static REFS = {
        DATA: "data",
        CONTENT: "content",
        IFRAME: "iframe",
        CONTAINER: "container",
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };

    protected rawList: T[];                    // исходные данные (массив)
    protected rawHash: IHashMap<any>;          // исходные данные (ключ -> индекс)
    protected dataList: T[];                   // данные для рендеринга (массив)
    protected dataHash: IHashMap<any>;         // данные для рендеринга (ключ -> индекс)
    protected renderedList: IRow<T>[];         // данные, которые были прорендерены (массив)
    protected renderedHash: IHashMap<any>;     // данные, которые были прорендерены (ключ -> индекс)
    protected selectedList: T[];               // список выбранных записей (массив)
    protected selectedHash: IHashMap<any>;     // список выбранных записей (ключ -> индекс)

    protected listenersFrame: IHashMapAny;     // событие на изменение размера таблицы
    protected resizeTimer: number;             // таймер при изменении размера таблицы
    protected refreshTimer: number;            // таймер для отложенного обновления таблицы
    protected dirty: boolean;                  // таблица нуждается в refresh'e

    protected syncTableList: Component<any>[]; // список компонентов для синхронизации с таблицей
    protected showingEmptyRow: boolean;        // флаг указвающий показывается ли пустая строка с текстом "нет данных"
    protected emptyRowColsLn: number;          // кол-во колонок в пустой строке

    protected scrollTop: number;               // текущая позиция скролла сверху
    protected scrollLeft: number;              // текущая позиция скролла слева
    protected renderScrollTop: number;         // на какой позиции скролла сверху был сделан рендер
    protected renderScrollLeft: number;        // на какой позиции скролла слева был сделан рендер

    protected width: number;                   // текущая ширина
    protected height: number;                  // текущая высота
    protected iframeWidth: number;             // ширина тега iframe
    protected iframeHeight: number;            // высота тега iframe

    protected mouseX: number;                  // позиция мыши по оси X
    protected mouseY: number;                  // позиция мыши по оси Y

    protected warnings: IHashMapBoolean;       // сообщения об ошибках при рендере (при одинаковых айдишниках)

    // загружает данные в таблицу
    public loadData(data: T[]): void {
        this.rawList = data || [];
        this.rawHash = {};

        data.forEach((item: T) => {
            let idRow: any = this.props.getId(item);

            this.rawHash[idRow] = item;
        });

        this.refresh();
    }

    public getData(): T[] {
        return this.rawList;
    }

    // получает модель данных по id
    public getRowById(id: any): T {
        if (this.rawHash.hasOwnProperty(id)) {
            return this.rawHash[id];
        }

        return null;
    }

    // получает ширину View
    public getWidth(): number {
        return this.width;
    }

    // получает высоту View
    public getHeight(): number {
        return this.height;
    }

    // получает ширину iframe
    public getIframeWidth(): number {
        return this.iframeHeight;
    }

    // получает высоту iframe
    public getIframeHeight(): number {
        return this.iframeHeight;
    }

    // возвращает список выбранных строк
    public getSelected(): T[] {
        return this.selectedList;
    }

    // устанавливает выделенные строки
    public doSelect(data: T | T[], inversion: boolean = false): void {
        // строки которые нужно выделить
        let toSelect: T[] = [];
        // строки с которых нужно снять выделение
        let toDeselect: T[] = [];
        // новый список с выделеными строками
        let selectedList: T[] = [];
        let selectedHash: IHashMap<any> = {};

        // если передали не массив строк
        if (!Array.isArray(data)) {
            data = [data];
        }

        // инверсия выделения
        if (inversion) {
            // inversion - инверсия строк
            // если строка была выделена, то снимем выделение
            // если строка не выделена, то выделим ее
            data.forEach((item: T) => {
                let idRow: any = this.props.getId(item);

                if (this.selectedHash.hasOwnProperty(idRow)) {
                    toDeselect.push(item);
                } else {
                    toSelect.push(item);
                }
            });
        } else {
            // сфоррмируем hash таблицу со строками, которые нужно выделить
            let dataHash: IHashMap<T> = arrayToObject(data, (item: T) => this.props.getId(item));

            // если в существующем списке нет строк которые есть в новом списке, то добавим их
            data.forEach((item: T) => {
                let idRow: any = this.props.getId(item);

                if (!this.selectedHash.hasOwnProperty(idRow)) {
                    toSelect.push(item);
                }
            });

            // если в существующем списке есть строки которых нет в новом списке, то уберем их
            this.selectedList.forEach((item: T) => {
                let idRow: any = this.props.getId(item);

                if (!dataHash.hasOwnProperty(idRow)) {
                    toDeselect.push(item);
                }
            });
        }

        // если изменений нет, выходим
        if (toSelect.length === 0 && toDeselect.length === 0) {
            return;
        }

        // формирование массива selected
        let toDeselectHash: IHashMap<T> = arrayToObject(toDeselect, (item: T) => this.props.getId(item));

        this.selectedList.forEach((item: T) => {
            let idRow: any = this.props.getId(item);

            if (!toDeselectHash.hasOwnProperty(idRow)) {
                selectedHash[idRow] = selectedList.length;
                selectedList.push(item);
            }
        });

        toSelect.forEach((item: T) => {
            let idRow: any = this.props.getId(item);

            selectedHash[idRow] = selectedList.length;
            selectedList.push(item);
        });

        // вызов событий
        let isManyDeselect: boolean = this.fireManyEvents(toDeselect, "onBeforeDeselect", true);
        let isManySelect: boolean = this.fireManyEvents(toSelect, "onBeforeSelect", true);
        if (isManyDeselect && isManySelect) {
            // сохраним новый список с выбранными строками
            this.selectedList = selectedList;
            this.selectedHash = selectedHash;

            this.fireManyEvents(toDeselect, "onDeselect", false);
            this.fireManyEvents(toSelect, "onSelect", false);

            this.parent.emit("onSelectionChange", selectedList);

            // обновим нашу таблицу
            this.refresh();
        }
    }

    // проверяет находится ли строка в области видимости
    public isVisibleRow(data: T): boolean {
        return this.getVisibleInfo(data).inRange;
    }

    // устанавливает скролл на указанную позицию
    public scrollTo(scrollTop?: number, scrollLeft?: number): void {
        let content: HTMLDivElement = this.ref(ViewGrid.REFS.CONTENT) as HTMLDivElement;

        if (!isNumber(scrollTop)) {
            scrollTop = content.scrollTop;
        }

        if (!isNumber(scrollLeft)) {
            scrollLeft = content.scrollLeft;
        }

        content.scrollTo(scrollLeft, scrollTop);
    }

    // устанавливает скролл на указанную запись
    // если запись находится в зоне видимости
    // то метод ничего делать не будет
    // isTop - прикреплять снизу или сверху
    public scrollBy(data: T, isTop: boolean = true): void {
        let info: IVisibleInfo = this.getVisibleInfo(data);

        // находится в зоне видимости - выходим
        if (info.inRange || info.index === null) {
            return;
        }

        let rowHeight: number = this.props.bufferHeight;
        let scrollTop: number = info.index * rowHeight;

        if (isTop) {
            scrollTop -= info.shiftTop * rowHeight;
        } else {
            scrollTop -= this.height - rowHeight;
            scrollTop -= info.shiftBottom * rowHeight;
        }

        this.scrollTo(scrollTop);
    }

    // устанавливает чек в таблице
    public setCheck(data: T, checked: boolean): void {
        let grid: R = this.parent;

        (data as any).checked = checked; // TODO

        this.refresh();

        grid.emit("onCheckChange", data, checked);
    }

    // обновляет таблицу
    public refresh(): void {
        if (this.isRendered()) {
            this.onDelayRefresh();
        }
    }

    // находит модель данных по NODE узлу
    public getRecordByEl(el: HTMLElement): T {
        let nodeTr: HTMLTableRowElement = findParentNode(el, "tr", this.ref(ViewGrid.REFS.DATA)) as HTMLTableRowElement;

        if (nodeTr) {
            let idRow: string = nodeTr.getAttribute("data-row");

            if (this.dataHash.hasOwnProperty(idRow)) {
                let index: number = this.dataHash[idRow];

                return this.dataList[index];
            }
        }

        return null;
    }

    // обновляет строку у таблицы по записи
    public updateRowByData(data: T): void {
        let idRow: any = this.props.getId(data);
        this.updateRowById(idRow);
    }

    // обновляет строку у таблицы по id
    public updateRowById(idRow: any): void {
        if (this.renderedHash.hasOwnProperty(idRow)) {
            let index: number = this.renderedHash[idRow];
            let row: IRow<T> = this.renderedList[index];

            this.renderRow(row);
        }
    }

    // можно переопределить внутри плагина. по умолчанию мы ничего не регулируем
    public regulateRange(range: IRange): IRange {
        return {
            start: range.start,
            finish: range.finish
        };
    }

    // возвращает информацию по записи
    // находится ли она в зоне видимости или нет
    // на какой позиции (index)
    public getVisibleInfo(data: T): IVisibleInfo {
        let range: IRange = this.findVisibleRange();
        let idRow: any = this.props.getId(data);

        // для плагинов. этот метод может быть переопределен
        let info: IVisibleInfo = this.regulateRange(range) as IVisibleInfo;

        // смещение сверху и снизу
        info.shiftTop = info.start - range.start;
        info.shiftBottom = range.finish - info.finish;

        // позиция записи и находится ли она в области видимости
        info.index = null;
        info.inRange = false;

        if (this.dataHash.hasOwnProperty(idRow)) {
            info.index = this.dataHash[idRow];

            if (info.start <= info.index && info.index < info.finish) {
                info.inRange = true;
            }
        }

        return info;
    }

    // отложенный вызов обновления размеров таблицы
    public asyncUpdateSize(): void {
        this.parent.emit("onChangeFrameSize");

        if (this.resizeTimer === null) {
            this.resizeTimer = window.setTimeout(() => {
                this.resizeTimer = null;
                this.updateSize();
            }, 100);
        }
    }

    // обновление размеров таблицы
    public updateSize(): void {
        let head: HeadGrid<T> = this.parent.getHead();
        let content: HTMLDivElement = this.ref(ViewGrid.REFS.CONTENT) as HTMLDivElement;

        let boundContent: ClientRect = content.getBoundingClientRect();

        if (boundContent.width === 0 && boundContent.height === 0) {
            this.setDirty(true);
            return;
        }

        // если изменились размеры фрейма
        let changeSize: boolean = this.width !== boundContent.width || this.height !== boundContent.height;
        // если мы пытались вызвать рефреш, когда таблица была спрятана
        let shouldRefresh: boolean = this.dirty;
        // бага в ФФ. когда у таблицы стоит display: none,
        // а потом display: block, scrollTop слетает в 0
        let changeScrollTop: boolean = this.scrollTop !== content.scrollTop;

        if (changeSize || shouldRefresh || changeScrollTop) {
            this.width = boundContent.width;
            this.height = boundContent.height;

            let iframe: HTMLDivElement = this.ref(ViewGrid.REFS.IFRAME) as HTMLDivElement;
            let boundIframe: ClientRect = iframe.getBoundingClientRect();
            this.iframeWidth = boundIframe.width;
            this.iframeHeight = boundIframe.height;

            // бага в ФФ. восстановим позицию слетевшего скрола
            if (changeScrollTop) {
                content.scrollTop = this.scrollTop;
            }

            this.parent.emit("onChangeViewSize", this.width, this.height);

            if (this.dirty) {
                this.setDirty(false);
            }

            head.refreshColSize();
        }
    }

    // добавляет для компонент синхронизации
    public addSyncTable(syncTable: Component<any>): void {
        this.syncTableList.push(syncTable);
    }

    // получает список компонентов для синхронизации
    public getSyncTableList(): Component<any>[] {
        return this.syncTableList;
    }

    // обновляет таблицу с задержкой
    protected onDelayRefresh(): void {
        if (this.refreshTimer === null) {
            this.refreshTimer = window.setTimeout(() => {
                this.refreshTimer = null;

                // выполним обновление
                this.executeRefresh();
            }, 1);
        }
    }

    // обновляет список для рендеринга и производит рендеринг
    protected executeRefresh(): void {
        this.updateListRender();

        if (this.isRendered()) {
            this.viewRefresh(false);
        }
    }

    // обновляет контент таблицы
    // onlyInsertOrRemove - делать проверку только на добавление \ удаление
    //                      игнорировать проверку изменений
    protected viewRefresh(onlyInsertOrRemove: boolean): void {
        // если ширина и высота таблицы равна по нулям, то скорее всего она скрыта
        // ее нужно пометить как "грязную" и прекратить refresh
        if (!this.width && !this.height) {
            this.setDirty(true);
            return;
        }

        // обновим позицию скрола
        this.renderScrollTop = this.scrollTop;
        this.renderScrollLeft = this.scrollLeft;

        let body: HTMLTableElement = this.ref(ViewGrid.REFS.BODY) as HTMLTableElement;
        let range: IRange = this.findDisplayRange();
        let dataList: T[] = this.getRenderList(range);

        this.updateHeightContainer();
        this.updatePositionContainer(range);
        this.updateEmptyRow(body, dataList.length);

        this.renderData(this as any, body, range, dataList, onlyInsertOrRemove);

        this.updateTableWidth();
        this.updateScrollBar();

        this.parent.emit("onRefresh", onlyInsertOrRemove);
    }

    // обновляет контент у таблицы
    // context - context
    // body - контейнер куда вставлять новые записи
    // range - диапазон "с" "по" записей которые нужно прорендерить
    // dataList - список record'ов которые нужно прорендерить
    // onlyInsertOrRemove - простое обновление, игнорировать update row
    protected renderData(
        context: IContext<T>,
        body: HTMLTableElement,
        range: IRange,
        dataList: T[],
        onlyInsertOrRemove: boolean
    ): void {
        let currRenderedList: IRow<T>[] = context.renderedList;
        let currRenderedHash: IHashMap<number> = context.renderedHash;

        let nextRenderedList: IRow<T>[];
        let nextRenderedHash: IHashMap<number> = {};
        let index: number = 0;

        dataList = dataList.filter((item: T) => {
            let idRow: any = this.props.getId(item);

            // защита, чтобы небыло дублированных ключей из за этого падает таблица
            if (nextRenderedHash.hasOwnProperty(idRow)) {
                this.printError(idRow, dataList);
                return false;
            }

            nextRenderedHash[idRow] = index++;
            return true;
        });

        // создадим новый контент
        nextRenderedList = dataList.map((item: T, i: number) => {
            let idRow: any = this.props.getId(item);
            let selected: boolean = this.selectedHash.hasOwnProperty(idRow);

            let row: IRow<T>;

            if (currRenderedHash.hasOwnProperty(idRow)) {
                row = currRenderedList[currRenderedHash[idRow]];

                row.idRow = idRow;
                row.data = item;
                row.selected = selected;
                row.index = range.start + i;

                if (onlyInsertOrRemove) {
                    return row;
                }

                this.renderRow(row);

                return row;
            }

            row = {
                idRow,
                data: item,
                selected,
                index: range.start + i,
                dataCells: { id: null, children: [] },
                node: document.createElement("tr")
            };

            this.renderRow(row);

            return row;
        });

        // ------------------------------
        // найдем изменения и применим их

        // удалим все не нужные ноды
        currRenderedList.forEach((currRow: IRow<T>) => {
            if (!nextRenderedHash.hasOwnProperty(currRow.idRow)) {
                currRow.node.parentNode.removeChild(currRow.node);
                currRow.node = null;
            }
        });

        // добавим все необходимые ноды или
        // переместим их (допустим при сортировке)
        nextRenderedList.forEach((nextRow: IRow<T>, i: number) => {
            if (i < body.children.length) {
                let node: Node = body.children[i];

                if (nextRow.node !== node) {
                    body.insertBefore(nextRow.node, node);
                }
            } else {
                body.appendChild(nextRow.node);
            }
        });

        // сохраним новое состояние для следующего использования
        context.renderedList = nextRenderedList;
        context.renderedHash = nextRenderedHash;
    }

    // обновляет список записей для рендера, он может поменятся
    // допустим применив сортировку или фильтры в сторе
    protected updateListRender(): void {
        this.dataList = [];
        this.dataHash = {};

        this.rawList.forEach((item: T) => {
            let idRow: any = this.props.getId(item);

            this.dataList.push(item);
            this.dataHash[idRow] = item;
        });
    }

    // --------------------------------

    protected beforeInit(): void {
        let props: IViewProps<T> = this.props;

        if (typeof props.multiSelect !== "boolean") {
            props.multiSelect = false;
        }

        if (typeof props.emptyRowText !== "string") {
            props.emptyRowText = "Нет данных для отображения.";
        }

        if (typeof props.bufferEnable !== "boolean") {
            props.bufferEnable = true;
        }

        if (typeof props.bufferHeight !== "number") {
            props.bufferHeight = 29;
        }

        if (typeof props.bufferStock !== "number") {
            props.bufferStock = 10;
        }

        if (typeof props.bufferScrollMin !== "number") {
            props.bufferScrollMin = 250;
        }

        this.dataList = [];
        this.dataHash = {};
        this.renderedList = [];
        this.renderedHash = {};
        this.selectedList = [];
        this.selectedHash = {};

        this.resizeTimer = null;
        this.refreshTimer = null;
        this.dirty = false;

        this.syncTableList = [];
        this.showingEmptyRow = false;
        this.emptyRowColsLn = null;

        this.scrollTop = 0;
        this.scrollLeft = 0;
        this.renderScrollTop = 0;
        this.renderScrollLeft = 0;

        this.width = null;
        this.height = null;
        this.iframeWidth = null;
        this.iframeHeight = null;

        this.mouseX = null;
        this.mouseY = null;

        this.warnings = {};

        this.listenersFrame = {
            resize: () => {
                this.asyncUpdateSize();
            }
        };
    }

    // вызывается перед рендерингом
    protected beforeMount(): void {
        injectScrollbarInfo();
    }

    // вызывается после рендеринга
    protected afterMount(): void {
        let iframe: HTMLFrameElement = this.ref(ViewGrid.REFS.IFRAME) as HTMLFrameElement;
        if (iframe.contentWindow) {
            event.on(iframe.contentWindow as any, this.listenersFrame);
        } else {
            console.error("contentWindow not found!");
        }
    }

    // вызывается перед демонтированием
    protected beforeUnmount(): void {
        let iframe: HTMLFrameElement = this.ref(ViewGrid.REFS.IFRAME) as HTMLFrameElement;
        event.off(iframe.contentWindow as any, this.listenersFrame);

        if (this.resizeTimer !== null) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }

        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // устанавливает компонент в состояние "грязный", что говорит о том что его нужно прорефрешить
    private setDirty(dirty: boolean): void {
        // исскуственно изменяем размеры чтобы сработало событие resize
        this.css(ViewGrid.REFS.IFRAME, {
            width: dirty ? `10%` : "",
            height: dirty ? `10%` : ""
        });

        this.dirty = dirty;
    }

    // --------------------------------

    // добавляет строку, если данных в таблице нет
    private updateEmptyRow(body: HTMLTableElement, dataListLn: number): void {
        let columnsLn: number = this.props.columns.length;
        let tr: HTMLTableRowElement;

        if (this.showingEmptyRow) {
            // удаляем строчку, если данные появились
            if (dataListLn > 0) {
                this.showingEmptyRow = false;

                body.removeChild(body.children[0]);
            } else {
                dom.attr(body.children[0] as HTMLElement, {
                    colspan: this.emptyRowColsLn.toString()
                }, {
                    colspan: columnsLn.toString()
                }, false);

                this.emptyRowColsLn  = columnsLn;
            }
        } else {
            // добавляем строчку, если данные отсутствуют
            if (dataListLn === 0) {
                this.showingEmptyRow = true;
                this.emptyRowColsLn = columnsLn;

                tr = document.createElement("tr");
                body.appendChild(tr);

                let emptyRow: IDom = {
                    id: null,
                    children: [{
                        id: 1,
                        name: "td",
                        attr: { colspan: columnsLn.toString() },
                        cl: { "row-empty": true },
                        text: this.props.emptyRowText
                    }]
                };

                dom.update(tr, { }, emptyRow);
            }
        }
    }

    // обновляет высоту общего контейнера
    // если включена функция отображения видимой части таблицы
    private updateHeightContainer(): void {
        let height: string = "";

        if (this.props.bufferEnable) {
            let rowHeight: number = this.props.bufferHeight;
            let countRows: number = this.dataList.length;

            height = `${rowHeight * countRows}px`;
        }

        this.css(ViewGrid.REFS.CONTAINER, { height });
    }

    // обновляет отступ внутреннего контейнера
    // если включена функция отображения видимой части таблицы
    private updatePositionContainer(range: IRange): void {
        let position: string = "";

        if (this.props.bufferEnable) {
            let rowHeight: number = this.props.bufferHeight;
            let countRows: number = this.dataList.length;

            position = `${range.start * rowHeight}px`;
        }

        this.css(ViewGrid.REFS.WRAP, { top: position });
    }

    // обновляет показ\скрытие отступа в шапке таблице
    // если в контенте есть\нет скролла
    private updateScrollBar(): void {
        let wrapWidth: number = this.width;

        if (this.props.bufferEnable) {
            let rowHeight: number = this.props.bufferHeight;
            let countRows: number = this.dataList.length;
            let height: number = rowHeight * countRows;

            if (this.getHeight() < height) {
                wrapWidth -= getScrollbarSize();
            }
        } else {
            let content: HTMLDivElement = this.ref(ViewGrid.REFS.CONTENT) as HTMLDivElement;

            if (content.scrollHeight > content.clientHeight) {
                wrapWidth -= getScrollbarSize();
            }
        }

        if (wrapWidth > 0) {
            let syncTableList: Component<any>[] = this.getSyncTableList();
            let refName: string = ViewGrid.REFS.CONTENT;
            let width: string = `${wrapWidth}px`;

            syncTableList.forEach((instance: Component<any>) => {
                let ref: IRef = instance.$internal.refs[refName];
                if (ref) {
                    dom.css(ref.node, ref.dom.css, { width }, false);
                }
            });
        }
    }

    // растягивает таблицу на 100% если хотябы в одной из колонок
    // задана настройка flex (растянуть на всю ширину)
    private updateTableWidth(): void {
        let syncTableList: Component<any>[] = this.getSyncTableList();
        let grid: R = this.parent;
        let head: HeadGrid<T> = grid.getHead();
        let width: string = head.isUseFlex() ? "100%" : "";
        let refName: string = ViewGrid.REFS.TABLE;

        this.css(refName, { width });

        syncTableList.forEach((instance: Component<any>) => {
            let ref: IRef = instance.$internal.refs[refName];
            if (ref) {
                dom.css(ref.node, ref.dom.css, { width }, false);
            }
        });
    }

    // находит диапазон записей, которые нужно прорендерить
    private findDisplayRange(): IRange {
        if (!this.props.bufferEnable) {
            return {
                start: 0,
                finish: this.dataList.length
            };
        }

        let range: IRange = this.findVisibleRange();

        // делаем запас
        range.start -= this.props.bufferStock;
        range.finish += this.props.bufferStock;

        if (range.start < 0) {
            range.start = 0;
        }

        if (range.finish > this.dataList.length) {
            range.finish = this.dataList.length;
        }

        return range;
    }

    // находит видимый диапазон записей таблицы
    // если строка не помещается хотябы на 1px то
    // эту строку считаем как за пределами видимости
    private findVisibleRange(): IRange {
        let scrollTop: number = this.scrollTop;
        let rowHeight: number = this.props.bufferHeight;
        let countRows: number = this.dataList.length;
        let height: number = this.height;

        // huck
        let maxScroll: number = rowHeight * countRows - height;
        if (scrollTop > maxScroll) {
            scrollTop = maxScroll;
        }

        let start: number = Math.ceil(scrollTop / rowHeight);
        let finish: number = Math.floor((scrollTop + height) / rowHeight);

        if (finish > countRows) {
            finish = countRows;
        }

        return { start, finish };
    }

    // получает список записей, которые нужно прорендерить
    private getRenderList(range: IRange): T[] {
        let result: T[] = [];

        for (let i: number = range.start; i < range.finish; ++i) {
            result.push(this.dataList[i]);
        }

        return result;
    }

    // формирует контент для строки
    private getDataCells(row: IRow<T>, columns: IColumn<T, R>[], defaultMeta: IHashMapAny): IDom[] {
        return columns.map((column: IColumn<T, R>, index: number) => {
            let value: string;
            let meta: IMeta<T, R> = {
                view: this.parent,
                row,
                column,
                data: row.data,
                attr: { "data-index": index.toString() },
                cl: { "ngrid-cell": true },
                css: {}
            };

            if (defaultMeta) {
                for (let key in defaultMeta) {
                    if (defaultMeta.hasOwnProperty(key)) {
                        meta[key] = defaultMeta[key];
                    }
                }
            }

            try {
                value = HeadGrid.columns[column.xtype].renderer(row.data, meta);

                if (value === "" || value === undefined || value === null) {
                    value = "&nbsp;";
                }
            } catch (e) {
                value = "&nbsp;";

                console.error(e);
            }

            if (column.align) {
                meta.cl[`row-${column.align}`] = true;
            }

            if (column.tdCls) {
                merge(meta.cl, column.tdCls);
            }

            return {
                id: column.id,
                name: "td",
                attr: meta.attr,
                cl: meta.cl,
                css: meta.css,
                text: value
            };
        });
    }

    // рендерит строку
    private renderRow(row: IRow<T>): void {
        let columns: IColumn<T, R>[] = this.props.columns as IColumn<T, R>[];
        let currCells: IDom = row.dataCells;
        let nextCells: IDom = {
            id: null,
            attr: { "data-row": row.idRow },
            cl: { "row-selected": row.selected },
            children: this.getDataCells(row, columns, null)
        };

        dom.update(row.node, currCells, nextCells);

        row.dataCells = nextCells;
    }

    // при изменении вертикального скролла
    private changeScrollTop(): void {
        // если буферизация выключена, выходим
        if (this.props.bufferEnable) {
            if (Math.abs(this.renderScrollTop - this.scrollTop) > this.props.bufferScrollMin) {
                this.viewRefresh(true);
            }
        }
    }

    // при изменении горизонтального скролла
    private changeScrollLeft(): void {
        let syncTableList: Component<any>[] = this.getSyncTableList();
        let content: HTMLDivElement = this.ref(ViewGrid.REFS.CONTENT) as HTMLDivElement;
        let left: string = `-${content.scrollLeft}px`;
        let refName: string = ViewGrid.REFS.TABLE;

        this.scrollLeft = content.scrollLeft;

        syncTableList.forEach((instance: Component<any>) => {
            let ref: IRef = instance.$internal.refs[refName];
            if (ref) {
                dom.css(ref.node, ref.dom.css, { left }, false);
            }
        });
    }

    // --------------------------------------------------------
    // bind events

    @on(ViewGrid.REFS.CONTENT, "scroll")
    private onScroll(): void {
        let content: HTMLDivElement = this.ref(ViewGrid.REFS.CONTENT) as HTMLDivElement;

        if (this.scrollTop !== content.scrollTop) {
            this.scrollTop = content.scrollTop;

            this.changeScrollTop();
        }

        if (this.scrollLeft !== content.scrollLeft) {
            this.scrollLeft = content.scrollLeft;

            this.changeScrollLeft();
        }

        this.parent.emit("onScroll", content.scrollTop, content.scrollLeft);
    }

    @on(ViewGrid.REFS.WRAP, "mousedown")
    private onMouseDown(e: MouseEvent): void {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.processEvent(e, "MouseDown", this.ref(ViewGrid.REFS.WRAP), false);
    }

    @on(ViewGrid.REFS.WRAP, "mouseup")
    private onMouseUp(e: MouseEvent): void {
        this.processEvent(e, "MouseUp", this.ref(ViewGrid.REFS.WRAP), false);
    }

    @on(ViewGrid.REFS.WRAP, "mousemove")
    private onMouseMove(e: MouseEvent): void {
        this.processEvent(e, "MouseMove", this.ref(ViewGrid.REFS.WRAP), false);
    }

    @on(ViewGrid.REFS.WRAP, "click")
    private onClick(e: MouseEvent): void {
        this.processEvent(e, "Click", this.ref(ViewGrid.REFS.WRAP), true);
    }

    @on(ViewGrid.REFS.WRAP, "dblclick")
    private onDblClick(e: MouseEvent): void {
        this.processEvent(e, "Dblclick", this.ref(ViewGrid.REFS.WRAP), true);
    }

    // --------------------------------------------------------

    /* tslint:disable:max-line-length */
    private processEvent(e: MouseEvent, eventName: string, rootNode: Node, needCheckAccuracy: boolean): void {
        let nodeTd: HTMLTableDataCellElement = findParentNode(e.target as Node, "td", rootNode) as HTMLTableDataCellElement;
        let nodeTr: HTMLTableRowElement = findParentNode(nodeTd, "tr", rootNode) as HTMLTableRowElement;

        if (nodeTr && nodeTd) {
            let idRow: string = nodeTr.getAttribute("data-row");
            let index: string = nodeTd.getAttribute("data-index");

            if (this.renderedHash.hasOwnProperty(idRow)) {
                let grid: R = this.parent;
                let column: IColumn<T, R> = this.props.columns[index];
                let row: IRow<T> = this.renderedList[this.renderedHash[idRow]];

                if (needCheckAccuracy && column.accuracyClick) {
                    if (this.mouseX !== e.clientX || this.mouseY !== e.clientY) {
                        return;
                    }
                }

                if (grid.emit(`onBeforeCell${eventName}`, nodeTd, index, row.data, nodeTr, row.index, e, column) !== false) {
                    grid.emit(`onCell${eventName}`, nodeTd, index, row.data, nodeTr, row.index, e, column);

                    if (grid.emit(`onBeforeItem${eventName}`, row.data, nodeTr, row.index, e) !== false) {
                        grid.emit(`onItem${eventName}`, row.data, nodeTr, row.index, e);
                    }
                }
            }
        }
    }
    /* tslint:enable:max-line-length */

    // --------------------------------------------------------

    // выводит сообщение об ошибке, когда пытаются прорендерить 2+ записи с одинаковым id
    private printError(idRow: any, dataList: T[]): void {
        // чтобы не хламить уведомления в консоли, будем выводить один раз
        if (!this.warnings.hasOwnProperty(idRow)) {
            this.warnings[idRow] = true;

            console.error(`found row with the same key (${idRow})! record will not be displayed!`);

            dataList.forEach((item: T) => {
                let itemIdRow: any = this.props.getId(item);
                if (idRow === itemIdRow) {
                    console.error(item);
                }
            });
        }
    }

    private fireManyEvents(data: T[], eventName: string, stopEvent: boolean): boolean {
        let ln = data.length;
        let successFireEvent;

        let grid: R = this.parent;

        for (let i = 0; i < ln; ++i) {
            successFireEvent = grid.emit(eventName, grid, data[i]) !== false;

            if (stopEvent && !successFireEvent) {
                return false;
            }
        }

        return true;
    }
}
