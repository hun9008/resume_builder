import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByUsername, updateUserResumeData } from "@/lib/user-service"

export async function GET() {
  try {
    // 세션 확인
    const username = cookies().get("user")?.value

    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 사용자 정보 조회
    const user = getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ resumeData: user.resumeData || {} })
  } catch (error) {
    console.error("Get resume data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const username = cookies().get("user")?.value

    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resumeData = await request.json()

    // 이력서 데이터 업데이트
    const success = updateUserResumeData(username, resumeData)

    if (!success) {
      return NextResponse.json({ error: "Failed to update resume data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update resume data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
