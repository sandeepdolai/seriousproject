import { NextResponse } from "next/server";

/**
 * Google OAuth is an external dependency (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
 * are not configured in this environment). The endpoint documents that clearly
 * instead of failing silently.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Google sign-in requires GOOGLE_CLIENT_ID configuration",
      provider: "google",
    },
    { status: 501 }
  );
}
