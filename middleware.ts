// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
// import { getRegisteredApps } from "@/lib/actions/apps";

// async function checkAppHealth(appUrl: string): Promise<boolean> {
//   try {
//     const response = await fetch(appUrl, { method: "HEAD", timeout: 3000 }); // Only check if it's up
//     return response.ok;
//   } catch (error) {
//     console.error(`🚨 Remote app is down: ${appUrl}`, error);
//     return false;
//   }
// }

// export default auth(async (req) => {
//   const isAuthenticated = !!req.auth;
//   const url = req.nextUrl;

//   console.log(`🔍 Request received for: ${url.pathname}`);

//   // 🔹 Require authentication for dashboard access
//   if (!isAuthenticated && url.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/api/auth/signin", req.url));
//   }

//   // 🔹 Proxy registered apps dynamically
//   if (url.pathname.startsWith("/apps/")) {
//     const appId = url.pathname.split("/")[2];
//     const apps = await getRegisteredApps();
//     const app = apps.find((a: any) => a.slug === appId);

//     if (app) {
//       console.log(`🔄 Checking if app is online: ${app.appUrl}`);

//       const isOnline = await checkAppHealth(app.appUrl);

//       if (!isOnline) {
//         console.log(`🚨 App is down: ${appId}, redirecting to /app-down`);
//         return NextResponse.redirect(new URL("/app-down", req.url));
//       }

//       return NextResponse.rewrite(
//         new URL(app.appUrl + url.pathname.replace(`/apps/${appId}`, ""))
//       );
//     } else {
//       console.log(`🚨 App not found: ${appId}`);
//       return NextResponse.redirect(new URL("/404", req.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/dashboard/:path*", "/apps/:path*"],
// };

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth(async (req: NextRequest) => {
  const isAuthenticated = !!req.auth;
  const url = req.nextUrl;

  // 🔹 Require authentication for dashboard access
  if (!isAuthenticated && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"]
};