import {Composer} from "./composer";

export class ModuleError {
    constructor(message: string, code: number, data: any) {
        this.message = message;
        this.code = code;
        this.data = data;
    }

    private message: string;
    private code: number;
    private data: any;
}

export function ServerError(data) {
    return new ModuleError('System error', -32000, data);
}

export function InvalidRequest(data) {
    return new ModuleError('Invalid request', -32600, data);
}

export function MethodNotFound(data) {
    return new ModuleError('Method not found', -32601, data);
}

export function InvalidParams(data) {
    return new ModuleError('Invalid params', -32602, data);
}

export function InternalError(data) {
    return new ModuleError('Internal error', -32603, data);
}

export function ParseError(data) {
    return new ModuleError('Parse error', -32700, data);
}


new Composer({
    defines: [],
    handlers: {
        init: init,
        reject: reject,
        resolve: resolve
    },
    options: {
        workers: 4
    }
});

async function init(method, params, sanction): Promise<any> {

}

async function reject(method, params, error): Promise<any> {

}

async function resolve(method, params, result): Promise<any> {

}