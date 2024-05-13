import { STATUS_CODES } from 'http';

interface HttpResponsePayload {
    statusCode: number;
    content: string|Buffer;
    contentType: string;
    additionalHeaders?: Record<string, string>;
}

export const buildHttpResponse = (payload: HttpResponsePayload): Buffer => {
    const body = payload.content instanceof Buffer
        ? payload.content
        : Buffer.from(payload.content, 'utf-8');
    const contentLength = body.toString().length;
    const headers = {
        'Content-Type': payload.contentType,
        'Content-Length': contentLength.toString(),
        ...payload.additionalHeaders,
    }
    const headersArray = Object.entries(headers).map(([key, value]) => `${key}: ${value}`);
    return Buffer.concat([
        Buffer.from(
            `HTTP/1.1 ${payload.statusCode} ${STATUS_CODES[payload.statusCode]}\r\n`
            + `${headersArray.join('\r\n')}\r\n`
            + '\r\n'
        ),
        body
    ]);
}