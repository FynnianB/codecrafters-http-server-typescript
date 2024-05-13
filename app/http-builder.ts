import { STATUS_CODES } from 'http';

interface HttpResponsePayload {
    statusCode: number;
    content: string;
    contentType: string;
}

export const buildHttpResponse = (payload: HttpResponsePayload) => {
    const contentLength = (new TextEncoder().encode(payload.content)).length;
    return `HTTP/1.1 ${payload.statusCode} ${STATUS_CODES[payload.statusCode]}\r\n`
        + `Content-Type: ${payload.contentType}\r\nContent-Length: ${contentLength}\r\n`
        + `${payload.content}`;
}