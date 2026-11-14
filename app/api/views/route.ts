import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Increments the view count for a patch log. Public, but intentionally cheap:
// POST one id, we only allow it via the service role RPC.
export async function POST(request: Request) {
  let body: { patchId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const patchId = body?.patchId;
  if (
    typeof patchId !== "string" ||
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      patchId
    )
  ) {
    return NextResponse.json({ error: "invalid patchId" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.rpc("increment_patch_view", {
    patch_id: patchId,
  });

  if (error) {
    console.error("increment_patch_view failed:", error);
    return NextResponse.json(
      { error: "failed to increment view count" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { view_count: data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
