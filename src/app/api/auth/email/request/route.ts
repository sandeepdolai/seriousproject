import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { sendLoginCode } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
  let body: { email?: unknown };
  try {
    body = (await req.json()) as { email?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    // Invalidate any previously issued unused codes for this email.
    await db.loginCode.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    await db.loginCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    const delivery = await sendLoginCode(email, code);
    if (delivery.sent) {
      return NextResponse.json({ success: true });
    }

    // Email delivery is not configured — return the code so the frontend can
    // show it as an in-modal dev hint.
    return NextResponse.json({
      success: true,
      devCode: delivery.devCode,
      devNote: "Email delivery not configured — dev code shown",
    });
  } catch (err) {
    console.error("[auth/email/request] Failed:", err);
    return NextResponse.json(
      { error: "Could not send the verification code. Please try again." },
      { status: 500 }
    );
  }
}
