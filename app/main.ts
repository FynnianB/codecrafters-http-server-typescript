import * as net from 'net';
import { buildHttpResponse } from './http-builder';
import { HttpRequest, parseRequest } from './parser';

const server: net.Server = net.createServer();

const handleRequest = (socket: net.Socket, req: HttpRequest) => {
    const routeSegments = req.path.split('/');
    switch ('/' + routeSegments[1]) {
        case '/':
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
            break;
        case '/echo':
            socket.write(buildHttpResponse({
                statusCode: 200,
                content: routeSegments[2] || 'No content',
                contentType: 'text/plain',
            }));
            break;
        case '/user-agent':
            const userAgent = req.headers['User-Agent'] || 'No User-Agent';
            socket.write(buildHttpResponse({
                statusCode: 200,
                content: userAgent,
                contentType: 'text/plain',
            }));
            break;
        default:
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            break;
    }
    socket.end();
}

server.on('connection', (socket: net.Socket) => {
    socket.on('data', (data: Buffer) => {
        const req = parseRequest(data.toString());

        handleRequest(socket, req);
    });
});

// Uncomment this to pass the first stage
server.listen(4221, 'localhost', () => {
    console.log('Server is running on port 4221');
});
