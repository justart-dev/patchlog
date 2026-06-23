import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET || "";

  if (expected && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tag, path, tags, paths } = body;
    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag, "max");
      revalidated.push(tag);
    }
    if (Array.isArray(tags)) {
      for (const t of tags) {
        revalidateTag(t, "max");
        revalidated.push(t);
      }
    }
    if (path) {
      revalidatePath(path, "page");
      revalidated.push(path);
    }
    if (Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p, "page");
        revalidated.push(p);
      }
    }

    if (revalidated.length === 0) {
      return NextResponse.json(
        { error: "Missing tag or path" },
        { status: 400 }
      );
    }

    return NextResponse.json({ revalidated: true, items: revalidated });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
