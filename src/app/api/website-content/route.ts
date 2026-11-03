import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

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
    console.error("Admin website content GET error:", error);

    return NextResponse.json(
      { error: "Unable to load website content." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (
      !body.content ||
      typeof body.content !== "object" ||
      Array.isArray(body.content)
    ) {
      return NextResponse.json(
        { error: "Invalid website content." },
        { status: 400 }
      );
    }

    const { data: existing, error: selectError } =
      await supabaseAdmin
        .from("website_content")
        .select("id")
        .limit(1)
        .maybeSingle();

    if (selectError) throw selectError;

    const updatedAt = new Date().toISOString();

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from("website_content")
        .update({
          content: body.content,
          updated_at: updatedAt,
          updated_by: admin.userId,
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("website_content")
        .insert({
          content: body.content,
          updated_at: updatedAt,
          updated_by: admin.userId,
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Website content saved successfully.",
    });
  } catch (error) {
    console.error("Admin website content PUT error:", error);

    return NextResponse.json(
      { error: "Unable to save website content." },
      { status: 500 }
    );
  }
}
