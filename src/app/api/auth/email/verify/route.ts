import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";

const SESSION_TTL_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

const ERR_INVALID_CODE = "Invalid or expired code. Please request a new one.";

export async function POST(req: Request) {
  let body: { email?: unknown; code?: unknown };
  try {
    body = (await req.json()) as { email?: unknown; code?: unknown };
  } catch {
    return NextResponse.json({ error: ERR_INVALID_CODE }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: ERR_INVALID_CODE }, { status: 400 });
  }

  try {
    const loginCode = await db.loginCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!loginCode) {
      return NextResponse.json({ error: ERR_INVALID_CODE }, { status: 400 });
    }

    await db.loginCode.update({
      where: { id: loginCode.id },
      data: { used: true },
    });

    // Upsert user (new users get 10 credits on the free plan).
    const existing = await db.user.findUnique({ where: { email } });
    const isNewUser = !existing;
    const user = existing
      ? await db.user.update({ where: { id: existing.id }, data: {} })
      : await db.user.create({
          data: {
            email,
            name: email.split("@")[0] || null,
            credits: 10,
            plan: "free",
          },
        });

    // Create session.
    const token = randomUUID();
    await db.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        plan: user.plan,
      },
      isNewUser,
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      path: "/",
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err) {
    console.error("[auth/email/verify] Failed:", err);
    return NextResponse.json(
      { error: "Could not verify the code. Please try again." },
      { status: 500 }
    );
  }
}
