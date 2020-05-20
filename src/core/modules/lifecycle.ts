
import { Internal } from "./../components/internal";

interface ICallback {
    internal: Internal;
    method: string;
}

class Lifecycle {

    public readonly METHODS = {
        BEFORE_INIT: "beforeInit",
        AFTER_INIT: "afterInit",

        BEFORE_MOUNT: "beforeMount",
        AFTER_MOUNT: "afterMount",

        BEFORE_UNMOUNT: "beforeUnmount",
        AFTER_UNMOUNT: "afterUnmount"
    };

    private list: ICallback[] = [];
    private depth: number = 0;

    public run(internal: Internal, method: string): void {
        internal.safeMethodCall(method);
    }

    public add(internal: Internal, method: string): void {
        if (internal.owner[method]) {
            this.list.push({ internal, method });
        }
    }

    public start(callback: (depth?: number) => void): void {
        ++this.depth;

        callback(this.depth);

        --this.depth;

        if (this.depth === 0 && this.list.length > 0) {
            this.list.forEach((cb: ICallback) => {
                cb.internal.safeMethodCall(cb.method);
            });

            this.list = [];
        }
    }
}

export const lifecycle = new Lifecycle();
