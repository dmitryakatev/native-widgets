
import { event, methodCall, IHashMapAny } from "core";
import { IHashMap } from "core";
import { Grid } from "./../../grid";
import { HeadGrid, IColumn } from "./../../headgrid/headgrid";
import { ICONS, createIcon } from "./../../../icons";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";
import { SettingsGrid, ISettingGrid } from "./settingsGrid";
import { arrayToObject, isNumber } from "./../../../utils/util";
import { correctionCoordinate, ICoord, ISize } from "./../../../utils/util";
import { IMeta } from "../../viewgrid/viewgrid";

interface IEventListeners extends IHashMap<(event: MouseEvent) => void> { }

interface IViewColumnsPluginProps extends IPluginProps {
    positionAdditionnalColumn?: number; // позиция доп. колонки относительно правого края
    settings?: ISetting[];
}

interface IExtendSetting {
    access: boolean;          // доступ к колонке, если false - то как будто колонки и нет
    allowSetting: boolean;    // возможность настраивать колонку
    allowAdditional: boolean; // разрешить скрывать колонку в доп. меню
    allowDraggable: boolean;  // разрешить перетаскивать колонку

    additional: boolean;      // колонка спрятана в доп. меню
    hidden: boolean;          // колонка скрыта
}

interface ISetting {
    column: string;
    additional: boolean;
    hidden: boolean;
}

// ----------------------------------------

let settingsGrid: SettingsGrid = new SettingsGrid();
let container: HTMLDivElement = document.createElement("div");
let activeMenu: ViewColumnsPlugin<any> = null;
let ignoreHideMenu: boolean = false;
let needRender: boolean = true;

(() => {
    container.setAttribute("class", "ngrid-setting-columns");

    event.on(window as any, {
        mousedown: () => {
            if (ignoreHideMenu) {
                ignoreHideMenu = false;
                return;
            }

            ViewColumnsPlugin.hide();
        }
    });

    event.on(container, {
        mousedown: () => {
            ignoreHideMenu = true;
        }
    });
})();

export class ViewColumnsPlugin<T> implements IPlugin {

    public static hide(): void {
        if (activeMenu !== null) {
            activeMenu.hidePopup();
        }
    }

    private grid: Grid<T>;
    private view: HTMLDivElement;
    private events: IEventListeners;
    private props: IViewColumnsPluginProps;

    private originalColumns: IColumn<T>[];
    private modityColumns: IColumn<T>[];
    private additionalColumns: IColumn<T>[];

    constructor(props: IViewColumnsPluginProps, grid: Grid<T>) {
        this.props = props;
        this.grid = grid;

        if (!isNumber(props.positionAdditionnalColumn)) {
            props.positionAdditionnalColumn = 0;
        }

        if (!Array.isArray(props.settings)) {
            props.settings = [];
        }

        this.events = {
            click: (e: MouseEvent): void => {
                this.showPopup(e);
            }
        };

        this.originalColumns = this.grid.getColumns();

        this.initSettings();
        this.update(this.props.settings);
    }

    public showPopup(e: MouseEvent): void {
        if (needRender) {
            needRender = false;
            document.body.appendChild(container);
            settingsGrid.appendChild(container);
        }

        let height: number = settingsGrid.getView().props.bufferHeight;
        let dataGrid: ISettingGrid[] = this.originalColumns.filter((column: IColumn<T>) => {
            return column.settings.allowSetting;
        }).map((column: IColumn<T>) => {
            return {
                id: column.dataIndex,
                name: column.text,
                allowAdditional: column.settings.allowAdditional,
                allowDraggable: column.settings.allowDraggable,
                additional: column.settings.additional,
                hidden: column.settings.hidden
            };
        });

        settingsGrid.setHeight(dataGrid.length * height + 1);
        settingsGrid.loadData(dataGrid);

        container.style.display = "block";
        activeMenu = this;

        this.updatePosition(e);
    }

    public hidePopup(): void {
        if (activeMenu === this) {
            container.style.display = "none";
            activeMenu = null;

            let data: ISettingGrid[] = settingsGrid.getData();
            let settings: ISetting[] = data.map((item: ISettingGrid) => {
                return {
                    column: item.id,
                    additional: item.additional,
                    hidden: item.hidden
                };
            });

            this.update(settings);
        }
    }

    public updatePosition(e: MouseEvent): void {
        let bound: ClientRect = this.view.getBoundingClientRect();
        let coord: ICoord = { x: e.clientX, y: e.clientY };
        let size: ISize = { width: bound.width, height: bound.height };

        coord = correctionCoordinate(coord, size);

        container.style.left = coord.x + "px";
        container.style.top = coord.y + "px";
    }

    protected initSettings(): void {
        this.originalColumns.forEach((column: IColumn<T>) => {
            if (!column.hasOwnProperty("settings")) {
                column.settings = {};
            }

            let settings: IExtendSetting = column.settings; // настройки колонки

            settings.access = settings.access !== false;                  // default: true
            settings.allowSetting = settings.allowSetting === true;       // default: false
            settings.allowAdditional = settings.allowAdditional === true; // default: false
            settings.allowDraggable = settings.allowDraggable === true;   // default: false
            settings.additional = settings.allowAdditional ? settings.additional === true : false; // default: false
            settings.hidden = settings.hidden === true;                   // default: false
        });
    }

    protected update(settings: ISetting[]): void {
        this.modityColumns = this.originalColumns.filter((column: IColumn<T>) => {
            return column.settings.access;
        });

        this.updateSettings(settings);
        this.updateSort(settings);
        this.updateProps();

        this.updateColumnList();

        this.grid.reconfigure(this.grid.props.columns);
    }

    protected updateSettings(s: ISetting[]): void {
        let settingsHash: IHashMap<ISetting> = arrayToObject(s, (setting: ISetting) => setting.column);

        this.modityColumns.forEach((column: IColumn<T>) => {
            let name: string = column.dataIndex;

            if (settingsHash.hasOwnProperty(name)) {
                let settings: IExtendSetting = column.settings;    // настройки колонки
                let customSettings: ISetting = settingsHash[name]; // кастомные настройки

                if (settings.allowAdditional && customSettings.hasOwnProperty("additional")) {
                    settings.additional = customSettings.additional;
                }

                if (customSettings.hasOwnProperty("hidden")) {
                    settings.hidden = customSettings.hidden;
                }
            }
        });
    }

    protected updateSort(settings: ISetting[]): void {
        settings.forEach((setting: ISetting, index: number) => {
            // 1
        });
    }

    protected updateProps(): void {
        this.props.settings = this.modityColumns.map((column: IColumn<T>) => {
            return {
                column: column.dataIndex,
                additional: column.settings.additional,
                hidden: column.settings.hidden
            };
        });
    }

    protected updateColumnList(): void {
        this.additionalColumns = this.modityColumns.filter((column: IColumn<T>) => {
            return column.settings.additional;
        });

        this.modityColumns = this.modityColumns.filter((column: IColumn<T>) => {
            return !column.settings.hidden && !column.settings.additional;
        });

        if (this.additionalColumns.length > 0) {
            let additionalColumn: IColumn<T> = this.createAdditionalColumn();
            let positionFromEnd: number = this.modityColumns.length - this.props.positionAdditionnalColumn;

            if (positionFromEnd < 0) {
                positionFromEnd = 0;
            }

            this.modityColumns.splice(positionFromEnd, 0, additionalColumn);
        }

        this.grid.getHead().props.columns = this.modityColumns;
        this.grid.props.columns = this.modityColumns;
    }

    protected createAdditionalColumn(): IColumn<T> {
        return {
            text: createIcon(ICONS.ADDITIONAL), // , "setting-columns-icon"
            dataIndex: "pluginadditionalcolumn",
            cls: "icon-header",
            tdCls: {
                "icon-cell": true
            },
            tooltip: "Настройка колонок",
            sortable: false,
            resizable: false,
            width: 29,
            renderer(value: string, meta: IMeta<IColumn<IHashMapAny>>, item: IHashMapAny): string {
                if (item.leaf) {
                    return createIcon(ICONS.ADDITIONAL); // , "setting-columns-icon"
                }

                return "";
            }
        };
    }

    protected mount(): void {
        this.initView();
        this.bindEvent();
    }

    protected unmount(): void {
        this.unbindEvent();
        this.cleanView();
    }

    protected initView(): void {
        let head: HeadGrid<T> = this.grid.getHead();
        let div: HTMLDivElement = methodCall(head, "ref", [HeadGrid.REFS.HEAD]);

        this.view = document.createElement("div");
        this.view.setAttribute("class", "setting-columns");
        this.view.innerHTML = createIcon(ICONS.SETTINGS, "setting-columns-icon");

        div.appendChild(this.view);
    }

    protected cleanView(): void {
        this.view = null;
    }

    protected bindEvent(): void {
        event.on(this.view, this.events);
    }

    protected unbindEvent(): void {
        event.off(this.view, this.events);
    }
}
