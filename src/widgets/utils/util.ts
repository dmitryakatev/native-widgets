
import { event, IHashMapAny } from "core";

// ищет родительский узел по имени тега
export function findParentNode(node: Node, parentName: string, root: Node): Node {
    while (node && node !== root) {
        if ((node.nodeName || "").toLowerCase() === parentName) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}

// -------------------------------

// из списка формирует ключ-значение
type FnCb<T> = (item: T, index: number, array: T[]) => any;

export function arrayToObject<T>(array: T[], getKey?: FnCb<T>, getVal?: FnCb<T>): IHashMapAny {
    let result = {};

    if (!getKey) {
        getKey = (item) => item;
    }

    if (!getVal) {
        getVal = (item) => item;
    }

    array.forEach((item: T, i: number) => {
        result[getKey(item, i, array)] = getVal(item, i, array);
    });

    return result;
}

// -------------------------------

let div: HTMLDivElement = null;
let cacheScrollbarSize: number = null;

export function injectScrollbarInfo(): void {
    if (div === null) {
        div = document.createElement("div");
        div.setAttribute("class", "ngrid-info-scroll");
        div.innerHTML = [
            `<div class="ngrid-info-scroll-child"></div>`,
            `<iframe src="" class="ngrid-info-scroll-iframe"></iframe>`
        ].join("");

        document.body.appendChild(div);

        event.on((div.children[1] as any).contentWindow as any, {
            resize: () => {
                cacheScrollbarSize = null;
            }
        });
    }
}

export function getScrollbarSize(): number {
    if (cacheScrollbarSize === null) {
        initScrollbarSize();
    }

    return cacheScrollbarSize;
}

function initScrollbarSize(): void {
    let main: ClientRect = div.getBoundingClientRect();
    let child: ClientRect = div.children[0].getBoundingClientRect();

    cacheScrollbarSize = main.width - child.width;
}

// -------------------------------

export interface ICoord {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export function correctionCoordinate(coord: ICoord, size: ISize): ICoord {
    let margin: number = 5;

    let bodyWidth: number = document.body.offsetWidth;
    let bodyHeight: number = document.body.offsetHeight;

    let endX: number = size.width + coord.x + margin;
    let endY: number = size.height + coord.y + margin;

    let needCorrectX: boolean = endX > bodyWidth;
    let needCorrectY: boolean = endY > bodyHeight;

    if (needCorrectX) {
        if (needCorrectY) {
            return {
                x: coord.x - size.width - margin,
                y: coord.y - size.height - margin
            };
        } else {
            return {
                x: coord.x - (endX - bodyWidth),
                y: coord.y + margin
            };
        }
    } else {
        if (needCorrectY) {
            return {
                x: coord.x + margin,
                y: coord.y - (endY - bodyHeight)
            };
        } else {
            return {
                x: coord.x + margin,
                y: coord.y + margin
            };
        }
    }
}

// -------------------------------

export function getDecl(titles: string[], count: number): string {
    let cases: number[] = [2, 0, 1, 1, 1, 2];
    return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
}

// -------------------------------

export function isNumber(value: any): boolean {
    return typeof value === "number" && isFinite(value);
}

// -------------------------------

export function reedProperty(object: IHashMapAny, property: string): any {
    return object[property];
}

export function writeProperty(object: IHashMapAny, property: string, value: any): void {
    object[property] = value;
}
