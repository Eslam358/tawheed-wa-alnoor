import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ملحوظة: Next.js 16 غيّر اسم الاصطلاح من "middleware" لـ "proxy"
// (نفس الوظيفة بالظبط، واسم الملف والـ export بس اللي اتغيّروا).
export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/orders/:path*", "/account"],
};
