export class NextResponse {
  static json(body: any, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(body), { ...init, headers });
  }
  static redirect(url: string, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    headers.set('Location', url);
    return new Response(null, { status: 307, ...init, headers });
  }
  static next(request: Request) {
    return request;
  }
}
