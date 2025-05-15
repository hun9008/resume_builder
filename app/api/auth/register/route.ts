import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/user-service"

// 인증 코드 (실제로는 환경 변수나 데이터베이스에서 관리해야 함)
const AUTH_CODE = "blahaj"

export async function POST(request: NextRequest) {
  try {
    const { username, authCode, password } = await request.json()

    // 인증 코드 검증
    if (authCode !== AUTH_CODE) {
      return NextResponse.json({ error: "Invalid authentication code" }, { status: 401 })
    }

    // 사용자 등록
    const success = registerUser(username, password)

    if (!success) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
