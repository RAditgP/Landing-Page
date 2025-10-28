// middleware.js
import { NextResponse } from "next/server";
import { getSession as getSessionFromDB } from "@/lib/auth";


// NOTE: middleware runs in edge runtime; direct DB calls may not be allowed on edge.
// Jika DB tidak bisa diakses di edge, letakkan middleware di server runtime dengan file config.

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const protectedPaths = ["/dashboard", "/app", "/admin"]; // sesuaikan

  // cek apakah request ke protected path
  if (!protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("session_token");
  const token = cookie?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // validasi session dari DB
  const session = await getSessionFromDB(token);
  if (!session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // opsional: set header user info ke request untuk dipakai downstream
  const res = NextResponse.next();
  res.headers.set("x-user-id", String(session.user_id));
  res.headers.set("x-user-email", session.email || "");
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/app/:path*", "/admin/:path*"],
};
