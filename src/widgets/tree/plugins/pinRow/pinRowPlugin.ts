
import { methodCall } from "core";
import { Tree } from "./../../tree";
import { ViewTree } from "../../viewtree/viewtree";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";
import { Container, PIN_ROW_MODE } from "./container";

export { PIN_ROW_MODE };

export class PinRowPlugin<T> implements IPlugin {

    private tree: Tree<T>;
    private container: Container<T>;

    constructor(props: IPluginProps, tree: Tree<T>) {
        this.tree = tree;
        this.container = new Container({ mode: props.mode });

        this.container.attachTree(tree);

        this.tree.on("onRefresh", (tr: Tree<T>, onlyInsertOrRemove: boolean) => {
            this.container.refresh(onlyInsertOrRemove);
        });

        this.tree.on("onScroll", (tr: Tree<T>, onlyInsertOrRemove: boolean) => {
            this.container.refresh(onlyInsertOrRemove);
        });
    }

    public setMode(mode: PIN_ROW_MODE): void {
        this.container.setMode(mode);
    }

    protected mount(): void {
        let view: ViewTree<T> =  this.tree.getView() as ViewTree<T>;
        let content: HTMLDivElement = methodCall(view, "ref", [ViewTree.REFS.CONTENT]);

        this.container.appendChild(content);
    }

    protected unmount(): void {
        this.container.remove();
    }
}
