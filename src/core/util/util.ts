
export interface IHashMap<T> {
    [propName: string]: T;
}

export interface IHashMapAny extends IHashMap<any> { }
export interface IHashMapNumber extends IHashMap<number> { }
export interface IHashMapString extends IHashMap<string> { }
export interface IHashMapBoolean extends IHashMap<boolean> { }

// -------------------------------------------

export function merge(to: IHashMapAny, a1: IHashMapAny): IHashMapAny {
    let obj: IHashMapAny;
    let key: string;

    const ln: number = arguments.length;
    for (let i: number = 1; i < ln; ++i) {
        obj = arguments[i];

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                to[key] = obj[key];
            }
        }
    }

    return to;
}

// -------------------------------------------

const calls = {
    0: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method]();
    },
    1: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0]);
    },
    2: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1]);
    },
    3: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2]);
    },
    4: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3]);
    },
    5: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4]);
    },
    6: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5]);
    },
    7: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    },
    8: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    },
    9: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
    },
    10: (inst: IHashMapAny, method: string | number, args: any[]): void => {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    }
};

export function methodCall(inst: IHashMapAny, method: string | number, args: any[]): any {
    if (args.length < 11) {
        return calls[args.length](inst, method, args);
    } else {
        return inst[method].apply(inst, args);
    }
}

// -------------------------------------------

const num: number = Math.random() * 10000000000;
let random: string = Math.floor(num).toString(32);
export const CODE = random.substr(random.length - 5);

// -------------------------------------------

const camelizeReg: RegExp = /[\-]([\w])/;
function camelizeFn(token: string) {
    return token[1].toUpperCase();
}

export function camelize(str: string): string {
    return str.replace(camelizeReg, camelizeFn);
}

const uncamelizeReg: RegExp = /([A-Z])/;
function uncamelizeFn(token: string) {
    return `-${token.toLowerCase()}`;
}

export function uncamelize(str: string): string {
    return str.replace(uncamelizeReg, uncamelizeFn);
}
