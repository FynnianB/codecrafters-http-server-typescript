import * as net from 'net';
import { readFileSync, writeFileSync } from "fs";
import { gzipSync } from "zlib";
import { argv } from "node:process";
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
            const encoding = req.headers['Accept-Encoding'];
            if (encoding && encoding.includes('gzip')) {
                const compressedContent =  gzipSync(routeSegments[2]);
                // socket.write(compressedContent);
                socket.write(buildHttpResponse({
                    statusCode: 200,
                    content: compressedContent.toString('hex'),
                    contentType: 'text/plain',
                    additionalHeaders: {
                        'Content-Encoding': 'gzip',
                    },
                }));
            } else {
                socket.write(buildHttpResponse({
                    statusCode: 200,
                    content: routeSegments[2] || 'No content',
                    contentType: 'text/plain',
                }));
            }
            break;
        case '/user-agent':
            const userAgent = req.headers['User-Agent'] || 'No User-Agent';
            socket.write(buildHttpResponse({
                statusCode: 200,
                content: userAgent,
                contentType: 'text/plain',
            }));
            break;
        case '/files':
            const dir = argv.slice(2)[1];
            const fileName = req.path.split('/files/')[1];
            const fullPath = dir + '/' + fileName;
            try {
                if (req.method === 'GET') {
                    const file = readFileSync(fullPath, 'utf-8');

                    if (file) {
                        socket.write(buildHttpResponse({
                            statusCode: 200,
                            content: file,
                            contentType: 'application/octet-stream',
                        }));
                    } else {
                        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                    }
                } else if (req.method === 'POST') {
                    writeFileSync(fullPath, req.content);
                    socket.write('HTTP/1.1 201 Created\r\n\r\n');
                }
            } catch (e) {
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            }
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