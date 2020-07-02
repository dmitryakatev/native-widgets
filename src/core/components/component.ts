
import { Internal, IRef } from "./internal";
import { lifecycle } from "./../modules/lifecycle";
import { ITemplate } from "./../modules/template";
import { dom } from "./../modules/dom";
import { appendChild, insertAfter, insertBefore, removeChild } from "./../util/dom";
import { merge, methodCall, IHashMap, IHashMapString, IHashMapBoolean, IHashMapAny } from "./../util/util";

export type IComponent = Component<IComponentProps>;

export interface IComponentProps {
    events?: IHashMapAny;
}

export function on(ref: string, eventName: string): any {
    return (ctor: any, methodName: string) => {
        if (!ctor.constructor.events) {
            ctor.constructor.events = [];
        }

        ctor.constructor.events.push({ ref, eventName, methodName });
    };
}

export class Component<
        TProps extends IComponentProps,
        R extends Component<IComponentProps> = Component<IComponentProps, any>
    > {

    public static template: ITemplate;

    public $internal: Internal;
    public parent: R;
    public props: TProps;

    constructor(props?: TProps, parent?: R) {
        this.parent = parent ? parent : null;
        this.props = props || ({} as TProps);

        this.$internal = new Internal(this);
        this.$internal.init();
    }

    // >>> работа с компонентом

    // добавляет компонент внутрь элемента
    public appendChild(node: HTMLElement): void {
        lifecycle.start(() => {
            this.$internal.onRender();
            appendChild(node, this.$internal.node);
        });
    }

    // добавляет компонент после элемента
    public insertAfter(node: HTMLElement): void {
        lifecycle.start(() => {
            this.$internal.onRender();
            insertAfter(node, this.$internal.node);
        });
    }

    // добавляет компонент перед элементом
    public insertBefore(node: HTMLElement): void {
        lifecycle.start(() => {
            this.$internal.onRender();
            insertBefore(node, this.$internal.node);
        });
    }

    // удаляет компонент
    public remove(): void {
        lifecycle.start((depth: number) => {
            if (depth === 1) {
                let node: Node = this.$internal.node;
                this.$internal.onDestroy();
                removeChild(node);
                node = null;
            } else {
                this.$internal.onDestroy();
            }
        });
    }

    // проверяет, был ли компонент прорендерен
    public isRendered(): boolean {
        return !!this.$internal.node;
    }

    // >>> работа с событиями

    // добавляет событие
    public on(eventName: string, fn: (...args: any[]) => void): void {
        this.$internal.emitter.on(eventName, fn);
    }

    // удаляет событие
    public off(eventName: string, fn: (...args: any[]) => void): void {
        this.$internal.emitter.off(eventName, fn);
    }

    // вызывает событие
    public emit(
            eventName: string,
            a1?: any,
            a2?: any,
            a3?: any,
            a4?: any,
            a5?: any,
            a6?: any,
            a7?: any,
            a8?: any,
            a9?: any,
            a10?: any
        ): boolean {
        let args: any[] = [arguments[0], this];

        let ln: number = arguments.length;
        for (let i: number = 1; i < ln; ++i) {
            args.push(arguments[i]);
        }

        return methodCall(this.$internal.emitter, "emit", args);
    }

    // >>> работа с виртуальным DOM
    // устанавливает свойства на DOM элемент
    protected prop(ref: string, value: IHashMapString, reset?: boolean): void {
        this.setAttr(ref, "prop", value, reset);
    }

    // устанавливает атрибуты на DOM элемент
    protected attr(ref: string, value: IHashMapString, reset?: boolean): void {
        this.setAttr(ref, "attr", value, reset);
    }

    // устанавливает классы на DOM элемент
    protected cl(ref: string, value: IHashMapBoolean, reset?: boolean): void {
        this.setAttr(ref, "cl", value, reset);
    }

    // устанавливает стили на DOM элемент
    protected css(ref: string, value: IHashMapString, reset?: boolean): void {
        this.setAttr(ref, "css", value, reset);
    }

    // получает реальный DOM по его имени
    protected ref(name: string): HTMLElement {
        if (this.$internal.refs.hasOwnProperty(name)) {
            return this.$internal.refs[name].node;
        }

        return null;
    }

    private setAttr(ref: string, key: string, value: IHashMapAny, reset?: boolean): void {
        let refs: IHashMap<IRef> = this.$internal.refs;

        if (!refs.hasOwnProperty(ref)) {
            refs[ref] = { node: null, dom: { prop: {}, attr: {}, cl: {}, css: {} } };
        }

        let r: IRef = refs[ref];

        if (r.node) {
            dom[key](r.node, r.dom[key], value, reset);
        } else {
            if (reset) {
                r.dom[key] = value; // need save reset
            } else {
                merge(r.dom[key], value);
            }
        }
    }
}
