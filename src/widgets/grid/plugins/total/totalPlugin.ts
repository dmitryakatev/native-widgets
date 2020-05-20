
import { methodCall } from "core";
import { Grid } from "./../../grid";
import { ViewGrid } from "../../viewgrid/viewgrid";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";
import { Container } from "./container";

export class TotalPlugin<T> implements IPlugin {

    private grid: Grid<T>;
    private container: Container<T>;

    constructor(props: IPluginProps, grid: Grid<T>) {
        this.grid = grid;
        this.container = new Container();

        grid.on("onChangeFrameSize", (gr: Grid<T>) => {
            // this.container.hide();
            this.container.updateTop(gr);
        });

        grid.on("onRefresh", (gr: Grid<T>, onlyInsertOrRemove: boolean) => {
            this.container.refresh(gr, onlyInsertOrRemove);
        });

        // очень важно!!! для синхронизации с основной таблицей
        let view: ViewGrid<T> =  this.grid.getView();
        view.addSyncTable(this.container);
    }

    public mount(): void {
        let view: ViewGrid<T> =  this.grid.getView();
        let padding: number = view.props.bufferHeight - 1;

        let content: HTMLDivElement = methodCall(view, "ref", [ViewGrid.REFS.CONTENT]);
        let container: HTMLDivElement = methodCall(view, "ref", [ViewGrid.REFS.CONTAINER]);

        this.container.appendChild(content);

        container.style.boxSizing = `content-box`;
        container.style.paddingBottom = `${padding}px`;
    }

    public unmount(): void {
        this.container.remove();
    }
}
