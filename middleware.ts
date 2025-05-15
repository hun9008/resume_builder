import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login"

  const sessionId = request.cookies.get("session_id")?.value
  const isAuthenticated = !!sessionId

  // 로그인되지 않은 사용자가 보호된 경로에 접근하려는 경우
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 로그인된 사용자가 로그인 페이지에 접근하려는 경우
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 적용될 경로 지정
export const config = {
  matcher: ["/", "/login"],
}
