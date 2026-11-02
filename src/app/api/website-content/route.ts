import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("website_content")
      .select("content, updated_at")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      content: data?.content || {},
      updated_at: data?.updated_at || null,
    });
  } catch (error) {
    console.error("Website content GET error:", error);

    return NextResponse.json(
      { error: "Unable to load website content." },
      { status: 500 }
    );
  }
}
