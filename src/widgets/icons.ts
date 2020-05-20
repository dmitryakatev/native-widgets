
export const ICONS = {
    HEADER_ARROW: "sort",
    CHECKBOX: "checkbox",
    CHECKBOX_CHECKED: "checkbox_checked",
    CHECKBOX_SQUARE: "checkbox_square",
    EXPANDED: "expanded",
    COLLAPSED: "collapsed",
    LEAF: "file",
    FOLDER_OPEN: "folder_open",
    FOLDER_CLOSE: "foler",
    SETTINGS: "settings",
    ADDITIONAL: "additional",
    DRAG_DROP_OK: "ok",
    DRAG_DROP_LOCK: "warn"
};

export function createIcon(icon: string, classes?: string, attrs?: string): string {
    let strAttr = classes ? ` class="${classes}"` : "";
    strAttr += attrs ? ` ${attrs}` : "";

    return `<img src="./../../img/${icon}.png"${strAttr} />`;
}
