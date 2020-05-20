
import { HelperEvent, EventFn, IStoreEvents } from "./helper.event";
import { event, SimpleEventFn } from "./../../util/event";
import { IHashMap } from "./../../util/util";

export class StoreEvent {

    private nodes: IHashMap<Node>;
    private store: IHashMap<IStoreEvents>;

    constructor() {
        this.clean();
    }

    public add(key: string, node: Node): void {
        this.nodes[key] = node;
    }

    public clean(): void {
        this.nodes = {};
        this.store = {};
    }

    public on(key: string, eventName: string, fn: SimpleEventFn): boolean {
        if (!this.store.hasOwnProperty(key)) {
            this.store[key] = {};
        }

        if (HelperEvent.on(this.store[key], eventName, fn)) {
            if (this.nodes) {
                event.on(this.nodes[key], { [eventName]: fn });
            }

            return true;
        }

        return false;
    }

    public off(key: string, eventName: string, fn: SimpleEventFn): boolean {
        if (this.store.hasOwnProperty(key)) {
            if (HelperEvent.off(this.store[key], eventName, fn)) {
                if (this.nodes) {
                    event.off(this.nodes[key], { [eventName]: fn });
                }
            }

            return true;
        }

        return false;
    }
}
