
import { CODE, IHashMapString, IHashMapBoolean } from "./../util/util";

export interface ITemplate {
    html: string;
    root?: IRoot;
}

interface IRoot {
    tagName: string;
    ref?: string;
    attr?: IHashMapString;
    cl?: IHashMapBoolean;
    css?: IHashMapString;
}

export function template(config: ITemplate): (ctor: any) => void {
    return (ctor: any) => {
        ctor.template = config;

        if (!config.root.ref) {
            config.root.ref = `root_${CODE}`;
        }

        if (config.html) {
            let strings: string[] = config.html.split(/\n/g);
            config.html = strings.map((str) => str.trim()).join(``);
        }
    };
}
