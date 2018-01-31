import {MethodNotFound} from "./errors";
import {Define} from "./define";
import {IMethod} from "./composer";

export class Processor {
    public handlers: any;
    private preparedMethods: { [key: string]: IMethod } = {};

    constructor(defines, handlers) {
        this.handlers = handlers || {};
        this.initDefines(defines);
    }

    initDefines(defines) {
        defines.forEach(define => {
            const props: string[] = Object.getOwnPropertyNames(define);
            const moduleName: string = (define.modulename || define.name).toLowerCase();

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