
import { HelperEvent, EventFn, IEventList } from "./helper.event";
import { methodCall, IHashMap } from "./../../util/util";

interface IEventListEmitter extends IEventList {
    registered?: boolean;
}

export { EventFn };

export class EmitterEvent {

    public readonly events: IHashMap<IEventListEmitter>;

    constructor() {
        this.events = {};
    }

    public on(eventName: string, fn: EventFn): boolean {
        return HelperEvent.on(this.events, eventName, fn);
    }

    public off(eventName: string, fn: EventFn): boolean {
        return HelperEvent.off(this.events, eventName, fn);
    }

    public emit(eventName: string, ...args: any[]): void {
        if (this.events.hasOwnProperty(eventName)) {
            const list: EventFn[] = this.events[eventName] as EventFn[];

            const ln: number = list.length;
            for (let i: number = 0; i < ln; ++i) {
                methodCall(list, i, args);
            }
        }
    }
}
