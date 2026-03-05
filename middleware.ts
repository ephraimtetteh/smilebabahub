import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("accessToken");

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };



export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/vendor/:path*", "/admin/:path*"],
};