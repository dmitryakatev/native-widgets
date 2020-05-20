
import { IHashMap } from "./util";

export type SimpleEventFn = (event: Event) => void;

type Listeners = IHashMap<SimpleEventFn> | IHashMap<SimpleEventFn[]>;

type ActionEvent = (el: Node, listeners: Listeners) => void;

interface IEvent {
    on: ActionEvent;
    off: ActionEvent;
}

export const event: IEvent = {
    on(el: Node, listeners: Listeners): void {
        let events: SimpleEventFn[];

        for (let eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                events = listeners[eventName] as SimpleEventFn[];

                if (Array.isArray(events)) {
                    let ln: number = events.length;
                    for (let i: number = 0; i < ln; ++i) {
                        el.addEventListener(eventName, events[i], false);
                    }
                } else {
                    el.addEventListener(eventName, events as SimpleEventFn, false);
                }
            }
        }
    },
    off(el: Node, listeners: Listeners): void {
        let events: SimpleEventFn[];

        for (let eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                events = listeners[eventName] as SimpleEventFn[];

                if (Array.isArray(events)) {
                    let ln: number = events.length;
                    for (let i: number = 0; i < ln; ++i) {
                        el.removeEventListener(eventName, events[i], false);
                    }
                } else {
                    el.removeEventListener(eventName, events as SimpleEventFn, false);
                }
            }
        }
    }
};
