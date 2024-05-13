import { readFileSync, writeFileSync } from "fs";
import { gzipSync } from "zlib";
import { argv } from "node:process";
import { buildHttpResponse } from './http-builder';
import { HttpServer } from '../http/server';

const server = new HttpServer();

server.get('/', () => {
    return buildHttpResponse(200);
});

server.get('/echo/*', (req) => {
    const message = req.path.split('/echo/')[1];

    const encoding = req.headers['Accept-Encoding'];
    if (encoding && encoding.includes('gzip')) {
        const compressed =  gzipSync(message);
        return buildHttpResponse(
            200,
            compressed,
            'text/plain',
            { 'Content-Encoding': 'gzip' }
        );
    }

    return buildHttpResponse(
        200,
        message,
        'text/plain',
    );
});

server.get('/user-agent', (req) => {
    const userAgent = req.headers['User-Agent'] || 'No User-Agent';
    return buildHttpResponse(200, userAgent, 'text/plain');
});

server.get('/files/*', (req) => {
    const dir = argv.slice(2)[1];
    const fileName = req.path.split('/files/')[1];
    const fullPath = dir + '/' + fileName;
    try {
        const file = readFileSync(fullPath, 'utf-8');
        if (file) {
            return buildHttpResponse(200, file, 'application/octet-stream');
        }

        return buildHttpResponse(404);
    } catch (e) {
        return buildHttpResponse(404);
    }
});

server.post('/files/*', (req) => {
    const dir = argv.slice(2)[1];
    const fileName = req.path.split('/files/')[1];
    const fullPath = dir + '/' + fileName;
    try {
        writeFileSync(fullPath, req.content);
        return buildHttpResponse(201);
    } catch (e) {
        return buildHttpResponse(404);
    }
});

server.listen(4221, 'localhost', () => {
    console.log('Server is running on port 4221');
});