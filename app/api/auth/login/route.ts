import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByUsername } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 사용자 검증
    const user = getUserByUsername(username)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // 세션 쿠키 설정
    const sessionId = crypto.randomUUID()
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1주일
      path: "/",
    })

    // 사용자 정보를 세션에 저장 (실제로는 서버 측 세션 저장소를 사용해야 함)
    cookies().set("user", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1주일
      path: "/",
    })

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
