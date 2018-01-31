import {Define, IDefine} from "./define";
import {MethodNotFound, ModuleError, ServerError} from "./errors";
import {Processor} from "./processor";

export interface IHandlers {
    init?: (request, method: IMethod) => Promise<any>;
    reject?: (request, method: IMethod, error) => Promise<any>;
    resolve?: (request, method: IMethod, result) => Promise<any>;
}

export interface IComposerOptions {
    workers: number;
}

export interface IComposition {
    defines: any[];
    handlers?: IHandlers;
    options?: IComposerOptions;
}

export interface IFeature {
    [key: string]: any;
}

export interface IMethod {
    feature?: IFeature;
    operation: (params?: any) => Promise<any>;
}

export interface Response {
    client: any;
    response: {
        jsonrpc: string;
        id: number | null;
        error: any;
        result: any;
    }
}

export class Composer extends Processor {

    constructor({defines, handlers, options}: IComposition) {
        super(defines, handlers);
    }

    async onRequest(client, request): Promise<Response> {
        let result, error;
        console.log(request, client)
        try {

            var method: IMethod = await this.getMethod(request.method);

            if (this.handlers.init) {
                await this.handlers.init.call(client, request, method);
            }

            result = await method.operation.call(client, request.params);

            if (this.handlers.resolve) {
                await this.handlers.resolve.call(client, request, method, result);
            }
        }
        catch (err) {
            if (err instanceof ModuleError) {
                error = err;
            }
            else {
                error = ServerError(err);
            }

            if (this.handlers.reject) {
                await this.handlers.reject.call(client, request, method, error);
            }
        }
        finally {
            return {
                client: client,
                response: {
                    jsonrpc: "2.0",
                    id: request.id,
                    result: result || undefined,
                    error: error || undefined,
                }
            };
        }
    }
}