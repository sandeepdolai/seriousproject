import { NextResponse } from "next/server";
import { promises as fsp } from "fs";
import path from "path";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Safely remove a file from public/<dir> when the URL points inside it. */
async function unlinkPublicFile(url: string | null | undefined, dir: string) {
  if (typeof url !== "string") return;
  const prefix = `/${dir}/`;
  if (!url.startsWith(prefix) || url.includes("..")) return;
  const filePath = path.join(process.cwd(), "public", dir, url.slice(prefix.length));
  await fsp.unlink(filePath).catch(() => undefined);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to manage your projects" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const project = await db.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this project" },
        { status: 403 }
      );
    }

    await db.project.delete({ where: { id } });

    // Clean up stored files (result + original) when they live in our folders.
    await unlinkPublicFile(project.resultImage, "results");
    await unlinkPublicFile(project.originalImage, "uploads");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[projects] Failed to delete:", err);
    return NextResponse.json(
      { error: "Could not delete the project. Please try again." },
      { status: 500 }
    );
  }
}
