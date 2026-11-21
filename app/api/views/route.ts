import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(`views:${clientKey(request)}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

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
