import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "pc_session";
export const SESSION_DURATION_DAYS = 30;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

/**
 * Read the pc_session cookie, look up the Session row and return the
 * authenticated user (or null when missing / expired / invalid).
 * Expired sessions are cleaned up on read.
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await db.session
      .delete({ where: { id: session.id } })
      .catch(() => undefined);
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    credits: session.user.credits,
    plan: session.user.plan,
  };
}
