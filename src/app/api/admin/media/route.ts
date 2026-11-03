
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

const BUCKET = "website-media";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function GET(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("website_media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ media: data || [] });
  } catch (error) {
    console.error("Media library GET error:", error);

    return NextResponse.json(
      { error: "Unable to load media library." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const category = String(formData.get("category") || "general");
    const altText = String(formData.get("alt_text") || "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a file." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, GIF and SVG images are allowed." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    const allowedCategories = [
      "general",
      "hero",
      "portfolio",
      "services",
      "team",
      "products",
      "gallery",
    ];

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid media category." },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "image";

    const filePath = `${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const { data: media, error: insertError } = await supabaseAdmin
      .from("website_media")
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_url: publicUrlData.publicUrl,
        mime_type: file.type,
        file_size: file.size,
        category,
        alt_text: altText.slice(0, 300),
        uploaded_by: admin.userId,
      })
      .select()
      .single();

    if (insertError) {
      await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      media,
      message: "Image uploaded successfully.",
    });
  } catch (error) {
    console.error("Media library upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = body?.id;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "A valid media ID is required." },
        { status: 400 }
      );
    }

    const { data: media, error: fetchError } = await supabaseAdmin
      .from("website_media")
      .select("id, file_path")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!media) {
      return NextResponse.json(
        { error: "Media file not found." },
        { status: 404 }
      );
    }

    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([media.file_path]);

    if (storageError) throw storageError;

    const { error: deleteError } = await supabaseAdmin
      .from("website_media")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("Media library DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to delete media." },
      { status: 500 }
    );
  }
        }
          
