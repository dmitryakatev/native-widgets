
import { HeadGrid, IHeadProps } from "./../../grid/headgrid/headgrid";
import { IMeta } from "./../../grid/viewgrid/viewgrid";
import { Tree, INode } from "./../tree";
import { ICONS, createIcon } from "./../../icons";

export interface IHeadTreeProps<T> extends IHeadProps<T> { }

export class HeadTree<
        T extends INode = INode,
        P extends IHeadTreeProps<T> = IHeadTreeProps<T>,
        R extends Tree<T> = Tree<T>
    > extends HeadGrid<T, P, R> {
    // empty
}

// регистрируем типы колонок

let base = HeadGrid.columns.basecolumn;

HeadGrid.registerColumn({
    xtype: "treecolumn",
    renderer<T extends INode, R extends Tree<T>>(node: T, meta: IMeta<T>) {
        let tree: R = meta.view as R;
        let depth: number = tree.props.rootVisible ? node.depth : node.depth - 1;
        let paddingLeft: number = 6 + (depth * 10);
        let circleIcon: string;
        let checkIcon: string;
        let icon: string;

        let isLeaf: boolean = node.leaf;
        let expanded: boolean = node.expanded;

        if (isLeaf) {
            if (meta.column.showLine) {
                circleIcon = `<div class="line${node.nextNodeId ? "" : " line-angle"}"></div>`;
            } else {
                circleIcon = "";
                paddingLeft += 12; // вместо иконки "плюс"\"минус"
            }
        } else {
            if (node.children.length === 0) {
                circleIcon = "";
                paddingLeft += 12; // вместо иконки "плюс"\"минус"
            } else {
                let circleIconId = expanded ? ICONS.EXPANDED : ICONS.COLLAPSED;
                circleIcon = createIcon(circleIconId, "image", 'action="expand"');
            }
        }

        if (meta.column.checkbox === false) {
            checkIcon = "";
        } else {
            let checkIconId: string;
            if (tree.props.syncCheckbox && node.checkedUndetermined) {
                checkIconId = ICONS.CHECKBOX_SQUARE;
            } else {
                checkIconId = node.checked ? ICONS.CHECKBOX_CHECKED : ICONS.CHECKBOX;
            }

            checkIcon = createIcon(checkIconId, "image check", `action="check"`);
        }

        if (meta.column.hideIcon) {
            icon = "";
        } else {
            let iconId: string = node.icon;
            if (!iconId) {
                iconId = isLeaf ? ICONS.LEAF : (expanded ? ICONS.FOLDER_OPEN : ICONS.FOLDER_CLOSE);
            }

            icon = createIcon(iconId, "image icon");
        }

        meta.cl.treecolumn = true;
        meta.css.paddingLeft = `${paddingLeft}px`;

        let value: string = base.renderer(node, meta);

        return `${circleIcon}${checkIcon}${icon}<span class="text">${value}</span>`;
    }
});
