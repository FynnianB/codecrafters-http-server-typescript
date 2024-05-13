export enum Method {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    PATCH = "PATCH",
}

export interface HttpRequest {
    method: Method;
    path: string;
    httpVersion: string;
    headers: Record<string, string>;
    content: string;
}