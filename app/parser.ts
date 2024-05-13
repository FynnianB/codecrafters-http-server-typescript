export interface HttpRequest {
    method: string;
    path: string;
    httpVersion: string;
    headers: Record<string, string>;
    content: string;
}

export const parseRequest = (req: string): HttpRequest => {
    const startLine = req.split('\r\n')[0];
    const excludeStartLine = req.split('\r\n').slice(1).join('\r\n');
    const headers = excludeStartLine.split('\r\n\r\n')[0];
    const content = excludeStartLine.split('\r\n\r\n')[1];
    const [method, path, httpVersion] = startLine.split(' ');

    return {
        method: method,
        path,
        httpVersion: httpVersion,
        headers: headers.split('\r\n').reduce((acc, header) => {
            const [key, value] = header.split(': ');
            acc[key] = value;
            return acc;
        }, {}),
        content,
    };
}