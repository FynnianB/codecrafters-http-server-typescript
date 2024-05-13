import * as net from 'net';

const server: net.Server = net.createServer();

server.on('connection', (socket: net.Socket) => {
    socket.on('data', (data: Buffer) => {
        const content = data.toString();
        const [startLine] = content.split('\r\n');
        const [_method, path, _httpVersion] = startLine.split(' ');

        if (path === '/') {
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        }

        socket.end();
    });
});

// Uncomment this to pass the first stage
server.listen(4221, 'localhost', () => {
    console.log('Server is running on port 4221');
});
