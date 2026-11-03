import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";

export const runtime = "nodejs";

type LogoSettings = {
  logoUrl?: string;
  logoLightUrl?: string;
};

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug")?.trim();

    const [portfolioResult, settingsResult] = await Promise.all([
      (async () => {
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

        return await query
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
      })(),

      supabaseAdmin
        .from("website_settings")
        .select("settings")
        .limit(1)
        .maybeSingle(),
    ]);

    if (portfolioResult.error) {
      throw portfolioResult.error;
    }

    if (settingsResult.error) {
      console.error(
        "Portfolio logo settings error:",
        settingsResult.error
      );
    }

    const settings = (
      settingsResult.data?.settings || {}
    ) as LogoSettings;

    const logos = {
      logoUrl:
        typeof settings.logoUrl === "string"
          ? settings.logoUrl
          : "",
      logoLightUrl:
        typeof settings.logoLightUrl === "string"
          ? settings.logoLightUrl
          : "",
    };

    const data = portfolioResult.data;

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
      slug
        ? {
            project: projects[0],
            logos,
          }
        : {
            projects,
            logos,
          }
    );
  } catch (error) {
    console.error("Public portfolio GET error:", error);

    return NextResponse.json(
      { error: "Unable to load portfolio projects." },
      { status: 500 }
    );
  }
}
