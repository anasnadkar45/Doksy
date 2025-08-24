// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  const baseDomain = "doksy.cloud"; // your main domain
  const currentHost = host.split(":")[0];

  if (currentHost.endsWith(baseDomain)) {
    const subdomain = currentHost.replace(`.${baseDomain}`, "");

    if (subdomain && subdomain !== "www") {
      // rewrite to /docs/[slug]
      url.pathname = `/docs/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
