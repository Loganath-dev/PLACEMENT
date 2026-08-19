import type { NextRequest as RealNextRequest } from "next/dist/server/web/spec-extension/request"
import type { NextResponse as RealNextResponse } from "next/dist/server/web/spec-extension/response"

export type NextRequest = RealNextRequest

export class NextResponse {
  static json(body: any, init?: ResponseInit) {
    const headers = new Headers(init?.headers)
    headers.set("Content-Type", "application/json")
    return new Response(JSON.stringify(body), { ...init, headers }) as unknown as RealNextResponse
  }
  static redirect(url: string | URL, init?: ResponseInit) {
    const headers = new Headers(init?.headers)
    headers.set("Location", url.toString())
    return new Response(null, { status: 307, ...init, headers }) as unknown as RealNextResponse
  }
  static next(options?: { request?: any }) {
    // Provide a mocked response that supports cookies for the Supabase client
    const res = new Response() as any
    Object.defineProperty(res, "cookies", {
      value: {
        set: (name: string, value: string, options?: any) => {},
        get: (name: string) => undefined,
        getAll: () => [],
        delete: (name: string) => {},
        has: (name: string) => false,
        clear: () => {},
      },
      writable: false
    })
    return res as RealNextResponse
  }
}
