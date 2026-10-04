import { NextResponse } from "next/server";

/**
 * Apple OAuth is an external dependency (APPLE_CLIENT_ID is not configured in
 * this environment). The endpoint documents that clearly instead of failing
 * silently.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Apple sign-in requires APPLE_CLIENT_ID configuration",
      provider: "apple",
    },
    { status: 501 }
  );
}
