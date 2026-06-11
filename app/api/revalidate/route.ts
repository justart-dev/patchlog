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
    const { tag, path } = body;

    if (tag) {
      revalidateTag(tag, "max");
      return NextResponse.json({ revalidated: true, tag });
    }

    if (path) {
      revalidatePath(path, "page");
      return NextResponse.json({ revalidated: true, path });
    }

    return NextResponse.json(
      { error: "Missing tag or path" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
