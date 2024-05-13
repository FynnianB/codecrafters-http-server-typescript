import { STATUS_CODES } from 'http';

export const buildHttpResponse = (
    statusCode: number,
    content?: string | Buffer,
    contentType?: string,
    additionalHeaders?: Record<string, string|number>,
): Buffer => {
    const startLineBuffer = Buffer.from(`HTTP/1.1 ${statusCode} ${STATUS_CODES[statusCode]}\r\n`);

    if (!content && !contentType) {
        return startLineBuffer;
    }

    const contentBuffer = content instanceof Buffer
        ? content
        : Buffer.from(content, 'utf-8');

    const headers = {
        'Content-Type': contentType,
        'Content-Length': contentBuffer.toString().length,
        ...additionalHeaders,
    }
    const headersArray = Object.entries(headers).map(([key, value]) => `${key}: ${value}`);
    const headersBuffer = Buffer.from(headersArray.reduce(
        (acc, header) => `${acc}${header}\r\n`, ''
    ));

    return Buffer.concat([startLineBuffer, headersBuffer, Buffer.from('\r\n'), contentBuffer]);
};