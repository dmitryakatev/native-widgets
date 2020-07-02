
import { Grid } from "./../../grid";
import { IColumn } from "./../../headgrid/headgrid";
import { ICONS, createIcon } from "./../../../icons";
import { IMeta } from "../../viewgrid/viewgrid";

export interface ISettingGrid {
    id: string;
    name: string;
    allowAdditional: boolean;
    allowDraggable: boolean;
    additional: boolean;
    hidden: boolean;
}

export class SettingsGrid extends Grid<ISettingGrid> {

    protected beforeInit(): void {
        super.beforeInit();

        this.props.bufferEnable = false;
        this.props.hideHead = true;

        this.props.plugins = [{
            type: "dragDropGrid"
        }];

        this.props.columns = [{
            width: 29,
            dataIndex: "checkbox",
            tdCls: {
                "ngrid-setting-columns-checkbox": true
            },
            renderer(value: string, meta: IMeta<ISettingGrid>, data: ISettingGrid): string {
                let iconId: string;

                if (data.additional) {
                    iconId = ICONS.CHECKBOX_SQUARE;
                } else {
                    iconId = data.hidden ? ICONS.CHECKBOX : ICONS.CHECKBOX_CHECKED;
                }

                return createIcon(iconId);
            }
        }, {
            flex: 1,
            dataIndex: "name",
            renderer(value: string, meta: IMeta<ISettingGrid>, data: ISettingGrid): string {
                return value;
            }
        }];

        // добавляем события

        function cellMouseDown_Grid(
            grid: Grid<ISettingGrid>,
            td: HTMLTableCellElement,
            columnIndex: number,
            data: ISettingGrid,
            tr: HTMLTableRowElement,
            rowIndex: number,
            event: MouseEvent,
            column: IColumn<ISettingGrid>
        ) {
            if (column.dataIndex === "checkbox") {
                if (data.additional) {
                    data.additional = false;
                    data.hidden = true;
                } else {
                    if (data.hidden) {
                        data.hidden = false;
                        data.additional = false;
                    } else {
                        if (data.allowAdditional) {
                            data.hidden = false;
                            data.additional = true;
                        } else {
                            data.hidden = true;
                            data.additional = false;
                        }
                    }
                }
            }

            grid.refresh();
        }

        this.on("onCellMouseDown", cellMouseDown_Grid);
    }
}
