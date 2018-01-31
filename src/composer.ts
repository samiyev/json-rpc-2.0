import {Define, IDefine} from "./define";
import {MethodNotFound} from "./errors";

export interface IHandlers {
    init: (method: string, params: any, sanction: any) => Promise<any>;
    reject: (method: string, params: any, error: any) => Promise<any>;
    resolve: (method: string, params: any, result: any) => Promise<any>;
}

export interface IComposerOptions {
    workers: number;
}

export interface IComposition {
    defines: any[];
    handlers: IHandlers;
    options: IComposerOptions;
}

export interface ISanction {
    [key: string]: any;
}

export interface IMethod {
    sanction?: ISanction;
    operation: (params?: any) => Promise<any>;
}

export class Composer {
    private preparedMethods = {};

    constructor({defines, handlers, options}: IComposition) {
        this.initDefines(defines);
    }

    initDefines(defines) {
        defines.forEach(define => {

            if (!(define instanceof Define)) {
                throw new Error('') //Todo-: Xatolikni etiborga olish kerak!
            }

            const props: string[] = Object.getOwnPropertyNames(define);
            const moduleName: string = define.modulename.toLowerCase();

            props.forEach(prop => {
                const method: IMethod = define[prop];

                if (method.operation && method.operation.constructor === Function) {
                    const methodFullname = `${moduleName}.${prop}`;
                    this.preparedMethods[methodFullname] = method;
                }

            });
        });
    }

    getMethod(name) {
        const method = this.preparedMethods[name];
        if (!method) throw MethodNotFound(method);
        return method;
    }
}