import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patchLogId = searchParams.get("patch_log_id");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (!patchLogId) {
      return NextResponse.json(
        { error: "patch_log_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_comment_id,
        user:users(id, username, first_name, last_name, profile_image_url, clerk_user_id)
      `)
      .eq("patch_log_id", patchLogId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    console.log("POST /api/comments - user:", user?.id);
    
    if (!user) {
      console.log("POST /api/comments - No user, returning 401");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const body = await request.json();
    const { patch_log_id, content, parent_comment_id } = body;
    
    console.log("POST /api/comments - body:", { patch_log_id, content, parent_comment_id });

    if (!patch_log_id || !content) {
      return NextResponse.json(
        { error: "patch_log_id and content are required" },
        { status: 400 }
      );
    }

    // 먼저 users 테이블에서 사용자 정보 확인/생성
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    let dbUserId = existingUser?.id;

    if (!existingUser) {
      // 사용자가 없으면 생성
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({ 
          clerk_user_id: userId,
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.imageUrl
        })
        .select("id")
        .single();

      if (userError) {
        console.error("Error creating user:", userError);
        throw userError;
      }
      dbUserId = newUser.id;
    }

    // 댓글 생성
    const { data, error } = await supabase
      .from("comments")
      .insert({
        patch_log_id,
        user_id: dbUserId,
        content,
        parent_comment_id: parent_comment_id || null,
      })
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_comment_id,
        user:users(id, username, first_name, last_name, profile_image_url, clerk_user_id)
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}