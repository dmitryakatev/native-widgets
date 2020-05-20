
import { Tree } from "./../../tree";
import { ViewTree } from "../../viewtree/viewtree";
import { IPlugin, IPluginProps } from "./../../../grid/plugins/plugin";
import { IHashMapAny } from "core";

interface ICustomNode extends IHashMapAny {
    $plugin_expanded?: boolean;
    $plugin_filter?: boolean;
    expanded?: boolean;
    parentNodeId?: any;
}

const escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g;

export class TreeFilterPlugin<T extends ICustomNode> implements IPlugin {

    private tree: Tree<T>;
    private applyingFilter: boolean;

    constructor(props: IPluginProps, tree: Tree<T>) {
        this.tree = tree;

        let view: ViewTree<T> = tree.getView() as ViewTree<T>;

        // @override
        let originalFilterNode = view.filterNode;
        view.filterNode = function(node: T) {
            return node.$plugin_filter !== false && originalFilterNode.call(this, node);
        };
    }

    public filter(searchText: string, fn: (node: T) => string): void {
        let root: T = this.tree.getData()[0];
        searchText = searchText.trim().toLowerCase();

        if (searchText) {
            // применим фильтр

            let reg: RegExp = this.getRegex(searchText);
            let success: T[] = [];

            this.tree.cascadeBefore(root, (node: T) => {
                // если фильтр еще не применялся, запомним его состояние
                // чтобы когда фильтр сбросили, можно было вернуть в прежнее состояние
                if (!this.applyingFilter)  {
                    node.$plugin_expanded = node.expanded;
                }

                // по умолчанию все ноды скроем
                node.expanded = false;

                // если родительский узел прошел фильтрацию то и все его
                // дочерние элементы автоматически проходят фильтрацию
                if (node.parentNode && node.parentNode.$plugin_filter) {
                    node.$plugin_filter = true;
                } else {
                    let text: string = fn ? fn(node) : node.text;

                    // проверяем, подходит ли узел фильтрацию
                    if (text.match(reg)) {
                        node.$plugin_filter = true;
                        success.push(node);
                    } else {
                        node.$plugin_filter = false;
                    }
                }
            });

            // каждый успошно пройденный фильтрацию узел мы будем
            // поднимать до root и проставлять filter = true
            // также раскроем его expanded = true
            success.forEach((node: T) => {
                node = tree.getRowById(node.parentNodeId);

                while (node) {
                    node.$plugin_filter = true;
                    node.expanded = true;

                    node = tree.getRowById(node.parentNodeId);
                }
            });
        } else {
            // очистим фильтр
            this.tree.cascadeBefore(root, (node) => {
                node.$plugin_filter = true;
                node.expanded = node.$plugin_expanded;
            });
        }

        this.applyingFilter = !!searchText;
        this.tree.refresh();
    }

    private getRegex(str: string): RegExp {
        str = str.replace(escapeRegexRe, "\\$1");
        return new RegExp(str, "i");
    }
}
