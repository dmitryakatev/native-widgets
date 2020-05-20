
import { CODE, IHashMap, IHashMapBoolean } from "./../../util/util";

export type EventFn = (...args: any[]) => void;

let eventKey: string = `__store__event__${CODE}`;
let eventNum: number = 0;

export interface IEventList extends Array<EventFn> {
    hash: IHashMapBoolean;
}

export interface IStoreEvents extends IHashMap<IEventList> { }

export class HelperEvent {

    public static on(events: IStoreEvents, eventName: string, fn: EventFn): boolean {
        let eventList: IEventList;

        if (events.hasOwnProperty(eventName)) {
            eventList = events[eventName];
        } else {
            eventList = HelperEvent.createEventList();
            events[eventName] = eventList;
        }

        if (!fn.hasOwnProperty(eventKey)) {
            fn[eventKey] = ++eventNum;
        }

        if (eventList.hash.hasOwnProperty(fn[eventKey])) {
            return false;
        }

        eventList.hash[fn[eventKey]] = true;
        eventList.push(fn);

        return true;
    }

    public static off(events: IStoreEvents, eventName: string, fn: EventFn): boolean {
        if (events.hasOwnProperty(eventName) && fn.hasOwnProperty(eventKey)) {
            let eventList: IEventList = events[eventName];
            let key: number = fn[eventKey];

            if (eventList.hash.hasOwnProperty(key)) {
                delete eventList.hash[key];

                let newEventList: IEventList = HelperEvent.createEventList();
                let ln: number = eventList.length;

                for (let i: number = 0; i < ln; ++i) {
                    if (eventList[i][eventNum] !== key) {
                        newEventList.push(eventList[i]);
                    }
                }

                newEventList.hash = eventList.hash;
                events[eventName] = newEventList;

                return true;
            }
        }

        return false;
    }

    public static createEventList(): IEventList {
        let eventList: IEventList = [] as IEventList;
        eventList.hash = {};
        return eventList;
    }
}
