import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

const BUCKET = "website-media";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const variant = formData.get("variant");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a logo image." },
        { status: 400 }
      );
    }

    if (variant !== "primary" && variant !== "light") {
      return NextResponse.json(
        { error: "Invalid logo type." },
        { status: 400 }
      );
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Use a PNG, JPG or WebP image." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Logo image must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    const filePath = `logos/${variant}-${crypto.randomUUID()}.${extension}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      message: "Logo uploaded successfully.",
      logo: {
        url: data.publicUrl,
        path: filePath,
        variant,
      },
    });
  } catch (error) {
    console.error("Website logo upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload logo. Please try again." },
      { status: 500 }
    );
  }
      }
