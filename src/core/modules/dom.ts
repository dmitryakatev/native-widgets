
import { camelize, uncamelize } from "./../util/util";
import { IHashMap, IHashMapAny, IHashMapString, IHashMapBoolean } from "./../util/util";

export interface IDom {
    id?: number;             // id тега
    name?: string;           // имя тега
    prop?: IHashMapString;   // свойства
    attr?: IHashMapString;   // атрибуты
    cl?: IHashMapBoolean;    // классы
    css?: IHashMapString;    // стили
    children?: IDom[];       // дочерние элементы
    text?: string;           // текст внутри тега

    [propName: string]: any; // произвольный набор параметров (рендериться не будет)
}

// класс для работы с виртуальным DOM

class Dom {

    // создает виртуальный DOM для Node
    public init(node: HTMLElement): IDom {
        let attr: IHashMapString = {};
        let cl: IHashMapBoolean = {};
        let css: IHashMapString = {};

        let attribute: Attr;
        let prop: string;
        let value: string;

        let ln: number = node.attributes.length;
        for (let i = 0; i < ln; ++i) {
            attribute = node.attributes[i];

            prop = attribute.name;
            value = attribute.nodeValue;

            if (prop === "class") {
                this.processingClasses(cl, value.split(" "));
            } else {
                if (prop === `style`) {
                    this.processingStyles(css, value.split(";"));
                } else {
                    attr[prop] = value;
                }
            }
        }

        return { prop: attr, attr, cl, css };
    }

    // обновляет разметку в соответствии с виртуальным DOM
    public update(node: HTMLElement, currDom: IDom = {}, nextDom: IDom): void {
        this.attr(node, currDom.attr || {}, nextDom.attr || {}, true);
        this.cl(node, currDom.cl || {}, nextDom.cl || {}, true);
        this.css(node, currDom.css || {}, nextDom.css || {}, true);

        if (nextDom.children) {
            if (!currDom.children) {
                currDom.children = [];
            }

            this.updateChildren(node, currDom, nextDom);
        } else {
            if (currDom.text !== nextDom.text) {
                node.innerHTML = nextDom.text;
            }
        }
    }

    public updateChildren(node: HTMLElement, currDom: IDom, nextDom: IDom): void {
        let nodeHash: IHashMap<HTMLElement> = {};
        let currDomHash: IHashMap<IDom> = {};
        let nextDomHash: IHashMap<IDom> = {};

        currDom.children.forEach((d: IDom, index: number) => {
            nodeHash[d.id] = node.children[index] as HTMLElement;
            currDomHash[d.id] = d;
        });

        nextDom.children.forEach((d: IDom, index: number) => {
            nextDomHash[d.id] = d;
        });

        currDom.children.forEach((d: IDom) => {
            if (!nextDomHash.hasOwnProperty(d.id)) {
                let child: HTMLElement = nodeHash[d.id];
                node.removeChild(child);
            }
        });

        nextDom.children.forEach((d: IDom, index: number) => {
            let child: HTMLElement;

            if (nodeHash.hasOwnProperty(d.id)) {
                child = nodeHash[d.id];
            } else {
                child = document.createElement(d.name);
            }

            this.update(child, currDomHash[d.id], d);

            if (index < node.children.length) {
                let target: Node = node.children[index];

                if (child !== target) {
                    node.insertBefore(child, target);
                }
            } else {
                node.appendChild(child);
            }
        });
    }

    // изменение свойств

    public attr(element: HTMLElement, original: IHashMapString, changes: IHashMapString, reset: boolean): void {
        let value: string;
        let key: string;

        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element.removeAttribute(key);
                }
            }

            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];

                    if (original[key] !== value) {
                        element.setAttribute(key, value);
                    }
                }
            }
        } else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];

                    if (original[key] !== value) {
                        original[key] = value;

                        element.setAttribute(key, value);
                    }
                }
            }
        }
    }

    public prop(element: HTMLElement, original: IHashMapAny, changes: IHashMapAny, reset: boolean): void {
        let value: string;
        let key: string;

        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element[key] = null;
                }
            }

            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    element[key] = changes[key];
                }
            }
        } else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];

                    if (original[key] !== value) {
                        original[key] = value;

                        element[key] = value;
                    }
                }
            }
        }
    }

    public cl(element: HTMLElement, original: IHashMapAny, changes: IHashMapAny, reset: boolean): void {
        let value: string = "";
        let klass: string;

        if (reset) {
            original = changes;
        } else {
            for (klass in changes) {
                if (changes.hasOwnProperty(klass)) {
                    if (original[klass] !== changes[klass]) {
                        original[klass] = changes[klass];
                    }
                }
            }
        }

        for (klass in original) {
            if (original[klass] === true) {
                if (value.length === 0) {
                    value = klass;
                } else {
                    value += ` ${klass}`;
                }
            }
        }

        if (value.length === 0) {
            element.removeAttribute("class");
        } else {
            element.setAttribute("class", value);
        }
    }

    public css(element: HTMLElement, original: IHashMapAny, changes: IHashMapAny, reset: boolean): void {
        let value: string;
        let key: string;

        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element.style[key] = null;
                }
            }

            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    element.style[key] = changes[key];
                }
            }
        } else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];

                    if (original[key] !== value) {
                        original[key] = value;

                        element.style[key] = value;
                    }
                }
            }
        }
    }

    private processingClasses(target: IHashMapBoolean, classes: string[]): void {
        let cl: string;
        let i: number;

        let ln: number = classes.length;
        for (i = 0; i < ln; ++i) {
            cl = classes[i].trim();

            if (cl.length > 0) {
                target[cl] = true;
            }
        }
    }

    private processingStyles(target: IHashMapString, styles: string[]): void {
        let style: string|string[];
        let value: string;
        let i: number;

        let ln: number = styles.length;
        for (i = 0; i < ln; ++i) {
            style = styles[i].split(":");

            if (style.length === 2) {
                value = style[1].trim();
                style = style[0].trim();

                if (style.length && value.length) {
                    target[camelize(style)] = value;
                }
            }
        }
    }
}

export const dom = new Dom();
