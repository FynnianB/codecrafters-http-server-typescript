import * as net from 'node:net';
import { HttpRequest, Method } from './http.types';
import { parseRequest } from './parser';

const NOT_FOUND_RESPONSE = 'HTTP/1.1 404 Not Found\r\n\r\n';

type callbackFn = (req: HttpRequest) => Buffer;

export class HttpServer {
    server: net.Server;
    socket: net.Socket;
    handlers: {
        [method: string]:{
            [path: string]: { regex: RegExp, fn: callbackFn };
        };
    } = {};

    constructor() {
        this.server = net.createServer((s) => {
            this.socket = s;
            this.socket.setEncoding('utf-8');
            this.socket.on('data', (data) => {
                const req = parseRequest(data.toString());
                const handler = Object.values(this.handlers[req.method]).find(
                    (handler) => req.path.match(handler.regex)
                );
                if (handler) {
                    const res = handler.fn(req);
                    this.socket.write(res);
                } else {
                    this.socket.write(NOT_FOUND_RESPONSE);
                }
            });
        });
    }

    public listen(port?: number, hostname?: string, listeningListener?: () => void): void {
        this.server.listen(port, hostname, listeningListener);
    }

    public get(path: string, fn: callbackFn): void {
        const regex = new RegExp(`^${path.replace('*', '.*')}$`);

        if (!this.handlers[Method.GET]) {
            this.handlers[Method.GET] = {};
        }

        this.handlers[Method.GET][regex.source] = { regex, fn };
    }

    public post(path: string, fn: callbackFn): void {
        const regex = new RegExp(`^${path.replace('*', '.*')}$`);

        if (!this.handlers[Method.POST]) {
            this.handlers[Method.POST] = {};
        }

        this.handlers[Method.POST][regex.source] = { regex, fn };
    }

}