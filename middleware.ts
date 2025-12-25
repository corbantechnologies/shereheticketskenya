export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*", "/organizer/:path*", "/(private)/:path*"],
};
