// proxy.ts
import nextAuthMiddleware from "next-auth/middleware";

export const proxy = nextAuthMiddleware;
export default nextAuthMiddleware;

export const config = {
  matcher: ["/admin/:path*", "/organizer/:path*", "/company/:path*"],
};
