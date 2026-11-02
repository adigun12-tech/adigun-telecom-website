import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug")?.trim();

    let query = supabaseAdmin
      .from("portfolio_projects")
      .select(`
        id,
        title,
        slug,
        short_description,
        description,
        category,
        technologies,
        cover_image,
        live_url,
        completion_status,
        display_order,
        created_at,
        portfolio_project_images (
          id,
          image_url,
          alt_text,
          display_order
        )
      `)
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

    const projects = (data || []).map((project) => ({
      ...project,
      portfolio_project_images: [
        ...(project.portfolio_project_images || []),
      ].sort(
        (a, b) => a.display_order - b.display_order
      ),
    }));

    return NextResponse.json(
      slug ? { project: projects[0] } : { projects }
    );
  } catch (error) {
    console.error("Public portfolio GET error:", error);

    return NextResponse.json(
      { error: "Unable to load portfolio projects." },
      { status: 500 }
    );
  }
}
