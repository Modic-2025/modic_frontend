import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.KAKAO_REST_API_KEY!;
  const redirectUri = process.env.KAKAO_REDIRECT_URI!;
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  return NextResponse.redirect(url);
}