import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to view your projects" },
      { status: 401 }
    );
  }

  try {
    const projects = await db.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        tool: true,
        title: true,
        prompt: true,
        originalImage: true,
        resultImage: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("[projects] Failed to list:", err);
    return NextResponse.json(
      { error: "Could not load projects. Please try again." },
      { status: 500 }
    );
  }
}
