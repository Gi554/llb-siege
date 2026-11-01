import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";

// First gate for the back-office: no valid session, no admin page.
// Pages and actions still call `requireUser()` for role and account checks.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/connexion")) return NextResponse.next();

  const session = await readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/connexion";
  url.search = pathname === "/admin" ? "" : `?suite=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
