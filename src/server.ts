import {Composer} from "./composer";
import * as Http from 'http';
import {ParseError} from "./errors";

export interface IServerOptions {
    host: any,
    port: number;
    session?: {
        status: boolean;
        keyname: string;
    }
}

export class RPCServer {
    private http: any;

    constructor(private options, private composer: Composer) {
        this.onInit();
    }

    onInit() {
        this.http = Http.createServer(this.callback.bind(this));
        this.http.listen(this.options, () => {
            console.log(`Server listining on ${this.options.host}:${this.options.port}`);
        });
    }

    async callback(request, response) {
        try {
            var body = await  this.getBody(request);
            var client = await this.prepareClient(request);
            var result = await this.composer.onRequest(client, body);

            this.sendResponse(result.client, result.response, response);
        }
        catch (error) {
            this.sendResponse(result.client, {error: error}, response);
        }
    }

    sendResponse(client, result, response) {
        result = JSON.stringify(result);
        result = new Buffer(result);

        var headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': result.length
        };

        if (client && client.session) {
            const keyname = this.options.session.keyname.toLowerCase();
            headers[keyname] = client[keyname];
        }

        response.writeHead(200, headers);
        response.end(result);
    }

    async getBody(request) {
        return new Promise((done, fail) => {

            request.once('data', (body) => {
                try {
                    done(JSON.parse(body.toString()));
                }
                catch (error) {
                    error = ParseError(error);
                    fail(error);
                }
            });
        });
    }

    async prepareClient(request) {
        const client = {};

        if (this.options.session && this.options.session.status === true) {
            const keyname = this.options.session.keyname.toLowerCase();
            client[keyname] = request.headers[keyname];
        }
        return client;
    }
}