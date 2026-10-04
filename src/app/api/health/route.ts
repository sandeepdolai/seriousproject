import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.user.count();
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("[health] DB check failed:", err);
    return NextResponse.json(
      { ok: false, db: "unavailable" },
      { status: 500 }
    );
  }
}
