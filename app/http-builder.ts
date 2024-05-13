import { STATUS_CODES } from 'http';

interface HttpResponsePayload {
    statusCode: number;
    content: string;
    contentType: string;
    additionalHeaders?: Record<string, string>;
}

export const buildHttpResponse = (payload: HttpResponsePayload) => {
    const contentLength = (new TextEncoder().encode(payload.content)).length;
    const headers = {
        'Content-Type': payload.contentType,
        'Content-Length': contentLength.toString(),
        ...payload.additionalHeaders,
    }
    const headersArray = Object.entries(headers).map(([key, value]) => `${key}: ${value}`);
    return `HTTP/1.1 ${payload.statusCode} ${STATUS_CODES[payload.statusCode]}\r\n`
        + `${headersArray.join()}\r\n`
        + '\r\n'
        + `${payload.content}`;
}