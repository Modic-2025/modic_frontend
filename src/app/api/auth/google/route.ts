import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_ID!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  const scope = process.env.GOOGLE_SCOPE!;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  return NextResponse.redirect(url);
}
