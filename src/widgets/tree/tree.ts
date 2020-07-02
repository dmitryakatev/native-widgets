
import { IHashMapAny } from "core";
import { Grid, IGridProps } from "./../grid/grid";

import { IColumn } from "./../grid/headgrid/headgrid";
import { HeadTree, IHeadTreeProps } from "./headtree/headtree";
import { ViewTree, IViewTreeProps } from "./viewtree/viewtree";

export interface ITreeProps<T> extends IGridProps<T> {
    rootVisible?: boolean;  // показывать\скрывать узел верхнего уровня
    syncCheckbox?: boolean; // вкл\выкл синхронизацию check со всем деревом
}

export interface INode extends IHashMapAny {
    leaf?: boolean;                 // указывает является запись папкой или узлом
    icon?: string;                  // иконка
    expanded?: boolean;             // раскрыть\спрятать дочерние узлы
    children?: INode[];             // массив дочерних элементов
    checked?: boolean;              // check
    checkedUndetermined?: boolean;  // находится ли check в неопределенном состоянии
    // auto (свойства генерируются автоматически)
    parentNodeId?: any;             // id родительского узла
    nextNodeId?: any;               // id следущего узла
    prevNodeId?: any;               // id предыдущего узла
    depth?: number;                 // глубина узла
}

export class Tree<T extends INode = INode, P extends ITreeProps<T> = ITreeProps<T>> extends Grid<T, P> {

    protected head: HeadTree<T, IHeadTreeProps<T>, Tree<T>>;
    protected view: ViewTree<T, IViewTreeProps<T>, Tree<T>>;

    // устанавливает check в узле
    public setCheck(node: T, checked: boolean): void {
        if (this.props.syncCheckbox) {
            this.cascadeBefore(node, (child: T) => {
                if (child.leaf) {
                    child.checked = checked;
                }
            });

            this.updateUndeterminedState();
        } else {
            node.checked = checked;
        }

        this.refresh();
        this.emit("checkchange", this, node, checked);
    }

    // раскрывает узел
    public expand(node: T): void {
        node.expanded = true;
        this.refresh();
    }

    // закрывает узел
    public collapse(node: T): void {
        node.expanded = false;
        this.refresh();
    }

    // сначала вызывается fn узла, а потом его потомков
    public cascadeBefore(node: T, fn: (node: T) => any): void {
        if (fn(node) === false) {
            return;
        }

        if (node.children) {
            node.children.forEach((child: T) => {
                this.cascadeBefore(child, fn);
            });
        }
    }

    // сначала вызывается fn потомков, а потом узла
    public cascadeAfter(node: T, fn: (node: T) => any): void {
        if (node.children) {
            node.children.forEach((child: T) => {
                this.cascadeAfter(child, fn);
            });
        }

        fn(node);
    }

    // обновляет все узлы на состояние "не определен"
    public updateUndeterminedState(): void {
        let root: T = this.getData()[0];

        this.cascadeAfter(root, (node: T) => {
            if (node.leaf) {
                node.checkedUndetermined = false;
            } else {
                if (node.children.length > 0) {
                    // кол-во чекнутых дочерних элементов
                    let countChecked: number = 0;
                    // был ли хотябы один дечерний элемент в состоянии "не определен"
                    let isUndetermined: boolean = false;

                    node.children.forEach((child) => {
                        if (child.checkedUndetermined) {
                            isUndetermined = true;
                        } else {
                            if (child.checked) {
                                ++countChecked;
                            }
                        }
                    });

                    if (countChecked === node.children.length) {
                        node.checked = true;
                        node.checkedUndetermined = false;
                    } else {
                        if (isUndetermined || countChecked > 0) {
                            node.checked = true;
                            node.checkedUndetermined = true;
                        } else {
                            node.checked = false;
                            node.checkedUndetermined = false;
                        }
                    }
                } else {
                    node.checkedUndetermined = false;
                }
            }
        });
    }

    // --------------------------------------------------------
    // приватные методы

    // вызывается перед инициализацией
    protected beforeInit(): void {
        this.props.rootVisible = this.props.rootVisible !== false;
        this.props.syncCheckbox = !!this.props.syncCheckbox;

        // ------------------------------------------

        function cellMouseDown_Tree(
            tree: Tree<T>,
            td: HTMLTableCellElement,
            columnIndex: number,
            node: T,
            tr: HTMLTableRowElement,
            rowIndex: number,
            event: MouseEvent,
            column: IColumn<T, Tree<T>>
        ) {
            if (column && column.xtype === "treecolumn") {
                let action: string = tree.findAction(event.target as HTMLElement, td);

                switch (action) {
                    case "expand":
                        if (node.expanded) {
                            tree.collapse(node);
                        } else {
                            tree.expand(node);
                        }
                        return false;
                    case "check":
                        tree.setCheck(node, !node.checked);
                        return false;
                }

            }
        }

        function itemDblClick_Tree(tree: Tree<T>, node: T) {
            if (!node.leaf) {
                node.expanded = !node.expanded;
            }

            tree.refresh();
        }

        this.on("onCellMouseDown", cellMouseDown_Tree);
        this.on("onItemdblClick", itemDblClick_Tree);

        super.beforeInit();
    }

    // находит наименование экшина по тегу
    protected findAction(node: HTMLElement, root: HTMLElement): string {
        while (node && node !== root) {
            let action: string = node.getAttribute("action");

            if (action) {
                return action;
            }

            node = node.parentNode as HTMLElement;
        }

        return null;
    }

    // создает заголовок дереваа
    protected initHead(): void {
        this.head = new HeadTree<T, IHeadTreeProps<T>, Tree<T>>({
            columns: this.props.columns
        }, this);
    }

    // создает контент дереваа
    protected initView(): void {
        this.view = new ViewTree<T, IViewTreeProps<T>, Tree<T>>({
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
}
