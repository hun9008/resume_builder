import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // 세션 쿠키 삭제
  cookies().delete("session_id")
  cookies().delete("user")

  return NextResponse.json({ success: true })
}
