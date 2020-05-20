
import { Component, IComponentProps } from "./component";

import { lifecycle } from "./../modules/lifecycle";
import { ITemplate } from "./../modules/template";
import { dom, IDom } from "./../modules/dom";
import { EmitterEvent, EventFn } from "./../modules/event/emitter.event";
import { StoreEvent } from "./../modules/event/store.event";

import { methodCall, IHashMap, IHashMapString, IHashMapBoolean } from "./../util/util";

export interface IRef {
    node: HTMLElement;
    dom: IDom;
}

interface IEventInfo {
    ref: string;
    eventName: string;
    methodName: string;
}

export class Internal {

    protected static autoId: number = 100000;

    public id: number;
    public owner: any; // todo

    public refs: IHashMap<IRef>;   // ссылки на Node элементы
    public storeEvent: StoreEvent; // хранилище событий
    public emitter: EmitterEvent;  // хранилище искусственных событий

    public node?: Node;

    constructor(component: Component<IComponentProps>) {
        ++Internal.autoId;

        this.id = Internal.autoId;
        this.owner = component;
        this.node = null;
        this.refs = {};
    }

    public init(): void {
        let ctor: any = this.owner.constructor;
        let template: ITemplate = ctor.template;

        this.emitter = new EmitterEvent();
        this.storeEvent = new StoreEvent();

        lifecycle.run(this, lifecycle.METHODS.BEFORE_INIT);

        let refRoot = template.root.ref;
        if (template.root.attr) {
            this.owner.attr(refRoot, template.root.attr);
        }

        if (template.root.cl) {
            this.owner.cl(refRoot, template.root.cl);
        }

        if (template.root.css) {
            this.owner.css(refRoot, template.root.css);
        }

        lifecycle.run(this, lifecycle.METHODS.AFTER_INIT);
    }

    // internal
    public safeMethodCall(methodName: string, args: any[] = []): void {
        if (this.owner[methodName]) {
            try {
                methodCall(this.owner, methodName, args);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public onRender(): void {
        let ctor: any = this.owner.constructor;
        let template: ITemplate = ctor.template;
        let tagName: string = template.root.tagName;
        let el: HTMLElement = document.createElement(tagName);

        el.innerHTML = template.html;
        this.node = el;

        this.initRefs(template);
        this.initEvents(ctor.events);

        lifecycle.run(this, lifecycle.METHODS.BEFORE_MOUNT);
        lifecycle.add(this, lifecycle.METHODS.AFTER_MOUNT);
    }

    public onDestroy(): void {
        lifecycle.run(this, lifecycle.METHODS.BEFORE_UNMOUNT);

        this.refs = {};
        this.node = null;
        this.storeEvent.clean();

        lifecycle.add(this, lifecycle.METHODS.AFTER_UNMOUNT);
    }

    private initRefs(template: ITemplate): void {
        let el: HTMLElement = this.node as HTMLElement;
        let refs: NodeList = el.querySelectorAll(`[ref]`);

        this.initRef(template.root.ref, el);

        Array.prototype.forEach.call(refs, (node: HTMLElement) => {
            let ref: string = node.getAttribute(`ref`);

            node.removeAttribute("ref");
            this.initRef(ref, node);
        });
    }

    private initRef(name: string, node: HTMLElement): void {
        let currRef: IRef = { node, dom: dom.init(node) };
        let nextRef: IRef = this.refs[name];

        if (nextRef) {
            dom.attr(node, currRef.dom.attr, nextRef.dom.attr, false);
            dom.cl(node, currRef.dom.cl, nextRef.dom.cl, false);
            dom.css(node, currRef.dom.css, nextRef.dom.css, false);
        }

        this.storeEvent.add(name, currRef.node);
        this.refs[name] = currRef;
    }

    private initEvents(events: IEventInfo[]): void {
        if (events) {
            events.forEach((eventInfo: IEventInfo) => {
                let event = this.createEvent(eventInfo.methodName, eventInfo.ref);
                this.storeEvent.on(eventInfo.ref, eventInfo.eventName, event);
            });
        }
    }

    private createEvent(methodName: string, ref: string): any {
        return (event: MouseEvent) => {
            this.safeMethodCall(methodName, [event, this.owner.ref(ref)]);
        };
    }
}
