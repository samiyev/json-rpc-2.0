import {Define, IDefine} from "./define";

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
            if(!(define instanceof Define)){
                throw new Error()
            }
            const props = Object.getOwnPropertyNames(define);
        });
    }
}

