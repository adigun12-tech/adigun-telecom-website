import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

const defaultSettings = {
  companyName: "Adigun Telecom",
  slogan: "Building Technology. Empowering Progress.",
  email: "adiguntelecoms@gmail.com",
  phone1: "07042723692",
  phone2: "09078440739",
  whatsapp: "2347042723692",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
  websiteTitle: "Adigun Telecom | Building Technology",
  metaDescription:
    "Adigun Telecom builds innovative digital solutions for businesses, schools and organisations.",
  maintenanceMode: false,
  logoUrl: "",
  logoPath: "",
  logoLightUrl: "",
  logoLightPath: "",
};

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
      .from("website_settings")
      .select("id, settings, updated_at")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      settings: {
        ...defaultSettings,
        ...(data?.settings || {}),
      },
      updated_at: data?.updated_at || null,
    });
  } catch (error) {
    console.error("Website settings GET error:", error);

    return NextResponse.json(
      { error: "Unable to load website settings." },
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
      !body.settings ||
      typeof body.settings !== "object" ||
      Array.isArray(body.settings)
    ) {
      return NextResponse.json(
        { error: "Invalid settings data." },
        { status: 400 }
      );
    }

    const allowedKeys = Object.keys(defaultSettings);

    const settings = Object.fromEntries(
      allowedKeys.map((key) => [
        key,
        body.settings[key] ??
          defaultSettings[key as keyof typeof defaultSettings],
      ])
    );

    const stringKeys = [
      "companyName",
      "slogan",
      "email",
      "phone1",
      "phone2",
      "whatsapp",
      "address",
      "facebook",
      "instagram",
      "linkedin",
      "x",
      "websiteTitle",
      "metaDescription",
      "logoUrl",
      "logoPath",
      "logoLightUrl",
      "logoLightPath",
    ] as const;

    for (const key of stringKeys) {
      if (typeof settings[key] !== "string") {
        return NextResponse.json(
          { error: `Invalid value for ${key}.` },
          { status: 400 }
        );
      }
    }

    if (typeof settings.maintenanceMode !== "boolean") {
      return NextResponse.json(
        { error: "Invalid maintenance mode value." },
        { status: 400 }
      );
    }

    const { data: existing, error: selectError } =
      await supabaseAdmin
        .from("website_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

    if (selectError) throw selectError;

    const payload = {
      settings,
      updated_at: new Date().toISOString(),
      updated_by: admin.userId,
    };

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from("website_settings")
        .update(payload)
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("website_settings")
        .insert(payload);

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Website settings saved successfully.",
    });
  } catch (error) {
    console.error("Website settings PUT error:", error);

    return NextResponse.json(
      { error: "Unable to save website settings." },
      { status: 500 }
    );
  }
         }
