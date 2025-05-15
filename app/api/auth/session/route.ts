import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByUsername } from "@/lib/user-service"

export async function GET() {
  try {
    // 세션 쿠키 확인
    const sessionId = cookies().get("session_id")?.value
    const username = cookies().get("user")?.value

    if (!sessionId || !username) {
      return NextResponse.json({ user: null })
    }

    // 사용자 정보 조회
    const user = getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
