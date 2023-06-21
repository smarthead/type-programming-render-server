import { IncomingMessage, ServerResponse } from 'http';

export function getPathname(request: IncomingMessage) {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  return url.pathname;
}

export function write(response: ServerResponse, statusCode: number, body?: string) {
  const headers: Record<string, any> = {
    'Content-Type': 'text/html'
  };

  if (body !== undefined) {
    headers['Content-Length'] = Buffer.byteLength(body);
  }

  response.writeHead(statusCode, headers);
  response.end(body);
}
