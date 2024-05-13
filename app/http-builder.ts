import { STATUS_CODES } from 'http';

interface HttpResponsePayload {
    statusCode: number;
    content: string;
    contentType: string;
}

export const buildHttpResponse = (payload: HttpResponsePayload) => {
    return `HTTP/1.1 ${payload.statusCode} ${STATUS_CODES[payload.statusCode]}\r\n`
        + `Content-Type: ${payload.contentType}\r\n\r\n`
        + `${payload.content}`;
}