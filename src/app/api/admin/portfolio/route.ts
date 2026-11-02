
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

const allowedCompletionStatuses = ["in_progress", "completed"];

function cleanText(value: unknown, maxLength = 10000) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function cleanGalleryImages(value: unknown) {
  if (!Array.isArray(value)) return null;

  return value
    .filter((item) => typeof item === "string")
    .map((item) => cleanText(item, 2000))
    .filter(Boolean)
    .slice(0, 30)
    .map((image_url, index) => ({
      image_url,
      display_order: index,
    }));
}

async function saveGalleryImages(projectId: string, images: unknown) {
  const galleryImages = cleanGalleryImages(images);

  if (galleryImages === null) return;

  const { error: deleteError } = await supabaseAdmin
    .from("portfolio_project_images")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (galleryImages.length === 0) return;

  const { error: insertError } = await supabaseAdmin
    .from("portfolio_project_images")
    .insert(
      galleryImages.map((image) => ({
        ...image,
        project_id: projectId,
      }))
    );

  if (insertError) throw insertError;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_projects")
      .select("*, portfolio_project_images(*)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("Admin portfolio GET error:", error);

    return NextResponse.json(
      { error: "Unable to load portfolio projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = cleanText(body.title, 200);
    const slugInput = cleanText(body.slug, 150);
    const slug = createSlug(slugInput || title);

    if (!title || !slug) {
      return NextResponse.json(
        { error: "A valid project title is required." },
        { status: 400 }
      );
    }

    const completionStatus = body.completion_status || "in_progress";

    if (!allowedCompletionStatuses.includes(completionStatus)) {
      return NextResponse.json(
        { error: "Invalid completion status." },
        { status: 400 }
      );
    }

    const technologies = Array.isArray(body.technologies)
      ? body.technologies
          .filter((item: unknown) => typeof item === "string")
          .map((item: string) => item.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 30)
      : [];

    const { data, error } = await supabaseAdmin
      .from("portfolio_projects")
      .insert({
        title,
        slug,
        short_description:
          cleanText(body.short_description, 500) || null,
        description: cleanText(body.description, 20000) || null,
        category: cleanText(body.category, 100) || null,
        technologies,
        cover_image: cleanText(body.cover_image, 2000) || null,
        live_url: cleanText(body.live_url, 2000) || null,
        completion_status: completionStatus,
        is_published: body.is_published === true,
        display_order: Number.isInteger(body.display_order)
          ? body.display_order
          : 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A project with this URL slug already exists." },
          { status: 409 }
        );
      }

      throw error;
    }

    if (Array.isArray(body.gallery_images)) {
      await saveGalleryImages(data.id, body.gallery_images);
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    console.error("Admin portfolio POST error:", error);

    return NextResponse.json(
      { error: "Unable to create portfolio project." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = cleanText(body.id, 100);

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.title === "string") {
      const title = cleanText(body.title, 200);

      if (!title) {
        return NextResponse.json(
          { error: "Project title cannot be empty." },
          { status: 400 }
        );
      }

      updates.title = title;
    }

    if (typeof body.slug === "string") {
      const slug = createSlug(body.slug);

      if (!slug) {
        return NextResponse.json(
          { error: "A valid project slug is required." },
          { status: 400 }
        );
      }

      updates.slug = slug;
    }

    if (typeof body.short_description === "string") {
      updates.short_description =
        cleanText(body.short_description, 500) || null;
    }

    if (typeof body.description === "string") {
      updates.description =
        cleanText(body.description, 20000) || null;
    }

    if (typeof body.category === "string") {
      updates.category = cleanText(body.category, 100) || null;
    }

    if (Array.isArray(body.technologies)) {
      updates.technologies = body.technologies
        .filter((item: unknown) => typeof item === "string")
        .map((item: string) => item.trim().slice(0, 80))
        .filter(Boolean)
        .slice(0, 30);
    }

    if (typeof body.cover_image === "string") {
      updates.cover_image = cleanText(body.cover_image, 2000) || null;
    }

    if (typeof body.live_url === "string") {
      updates.live_url = cleanText(body.live_url, 2000) || null;
    }

    if (typeof body.completion_status === "string") {
      if (!allowedCompletionStatuses.includes(body.completion_status)) {
        return NextResponse.json(
          { error: "Invalid completion status." },
          { status: 400 }
        );
      }

      updates.completion_status = body.completion_status;
    }

    if (typeof body.is_published === "boolean") {
      updates.is_published = body.is_published;
    }

    if (Number.isInteger(body.display_order)) {
      updates.display_order = body.display_order;
    }

    const hasGalleryUpdate = Array.isArray(body.gallery_images);

    if (Object.keys(updates).length === 0 && !hasGalleryUpdate) {
      return NextResponse.json(
        { error: "No valid project updates provided." },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString();

      const { error } = await supabaseAdmin
        .from("portfolio_projects")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    }

    if (hasGalleryUpdate) {
      await saveGalleryImages(id, body.gallery_images);
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_projects")
      .select("*, portfolio_project_images(*)")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error("Admin portfolio PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update portfolio project." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("portfolio_projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin portfolio DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to delete portfolio project." },
      { status: 500 }
    );
  }
}
