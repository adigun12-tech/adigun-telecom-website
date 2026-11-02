
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug")?.trim();

    let query = supabaseAdmin
      .from("portfolio_projects")
      .select(
        "id, title, slug, short_description, description, category, technologies, cover_image, live_url, completion_status, display_order, created_at"
      )
      .eq("is_published", true);

    if (slug) {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (slug && (!data || data.length === 0)) {
      return NextResponse.json(
        { error: "Portfolio project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      slug ? { project: data[0] } : { projects: data }
    );
  } catch (error) {
    console.error("Public portfolio GET error:", error);

    return NextResponse.json(
      { error: "Unable to load portfolio projects." },
      { status: 500 }
    );
  }
}
