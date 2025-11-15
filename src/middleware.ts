import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. 인증 쿠키의 이름을 설정합니다.
const AUTH_COOKIE_NAME = "accessToken";

// 2. 인증이 필요 없는 public 경로를 설정합니다. (로그인한 사용자가 접근 시 / 로 리다이렉트됨)
const PUBLIC_PATHS = ["/login", "/signup"];

// 3. 인증이 "필요한" private 경로를 명시적으로 설정합니다.
const PRIVATE_PATHS = ["/art/tree", "/art/ai", "/vote", "/search/user"];

/**
 * Next.js 미들웨어 함수
 */
export function middleware(request: NextRequest) {
  // 4. 현재 요청 경로
  const { pathname } = request.nextUrl;

  // 5. 요청에서 인증 쿠키를 가져옵니다.
  const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 6. 현재 경로가 public인지 private인지 확인합니다.
  const isPublic = isPathMatch(pathname, PUBLIC_PATHS);
  const isPrivate = isPathMatch(pathname, PRIVATE_PATHS);

  // 7. [시나리오 1] 인증이 필요한 경로 접근 제어 (Private 경로)
  // 쿠키가 없고 & 현재 경로가 "private" 경로인 경우
  if (!accessToken && isPrivate) {
    // 로그인 페이지로 리다이렉트
    const redirectPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    // 사용자가 원래 가려던 페이지를 'redirectUrl' 쿼리 파라미터로 추가
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectUrl", redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  // 8. [시나리오 2] 이미 로그인한 사용자의 public 경로 접근 제어 (Public 경로)
  // 쿠키가 있고 & 현재 경로가 "public" 경로인 경우
  if (accessToken && isPublic) {
    // 메인 대시보드 페이지('/')로 리다이렉트
    return NextResponse.redirect(new URL("/art", request.url));
  }

  // 9. 그 외 모든 경우 (e.g., public 경로에 비로그인 접근, private 경로에 로그인 접근,
  //    혹은 public/private 모두 아닌 경로 접근)는 요청을 그대로 통과시킵니다.
  return NextResponse.next();
}

/**
 * 현재 경로가 지정된 경로 목록과 일치하는지 확인하는 헬퍼 함수
 * @param pathname - 요청 경로
 * @param paths - 확인할 경로 배열
 */
function isPathMatch(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) =>
      // 정확히 일치하거나 (e.g., /login)
      pathname === path ||
      // 또는 하위 경로인 경우 (e.g., /dashboard/settings)
      // (단, '/' 경로는 하위 경로 체크에서 제외)
      (path !== "/" && pathname.startsWith(path + "/"))
  );
}

// 10. 미들웨어가 실행될 경로를 정의하는 Matcher
export const config = {
  matcher: [
    /*
     * 아래와 일치하는 경로를 *제외한* 모든 요청 경로에서 미들웨어를 실행합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - /public 폴더 내의 모든 것 (images, fonts 등)
     * - favicon.ico (파비콘)
     *
     * 이 설정은 모든 "페이지"에서 미들웨어가 실행되도록 보장합니다.
     * 실제 접근 제어는 위의 middleware 함수 로직(isPrivate, isPublic)이 담당합니다.
     */
    "/((?!api|_next/static|_next/image|images|fonts|favicon.ico).*)",
  ],
};
