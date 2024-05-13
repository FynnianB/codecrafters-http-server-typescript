import * as net from 'net';
import { buildHttpResponse } from './http-builder';

const server: net.Server = net.createServer();

const handleRequest = (socket: net.Socket, path: string) => {
    const routeSegments = path.split('/');
    switch ('/' + routeSegments[1]) {
        case '/':
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
            break;
        case '/echo':
            const res = buildHttpResponse({
                statusCode: 200,
                content: routeSegments[2] || 'No content',
                contentType: 'text/plain',
            });
            socket.write(res);
            break;
        default:
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            break;
    }
    socket.end();
}

server.on('connection', (socket: net.Socket) => {
    socket.on('data', (data: Buffer) => {
        const content = data.toString();
        const [startLine] = content.split('\r\n');
        const [_method, path, _httpVersion] = startLine.split(' ');

        handleRequest(socket, path);
    });
});

// Uncomment this to pass the first stage
server.listen(4221, 'localhost', () => {
    console.log('Server is running on port 4221');
});
