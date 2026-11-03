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
      .from("site_admins")
      .select("user_id, email, role, is_active")
      .order("email", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      administrators: data || [],
      currentAdmin: admin,
    });
  } catch (error) {
    console.error("Administrator GET error:", error);

    return NextResponse.json(
      { error: "Unable to load administrators." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin || admin.role !== "owner") {
      return NextResponse.json(
        { error: "Only the owner can invite administrators." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("site_admins")
      .select("user_id, is_active")
      .eq("email", email)
      .maybeSingle();

    if (existing?.is_active) {
      return NextResponse.json(
        { error: "This email is already an active administrator." },
        { status: 409 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://adigun-telecom-website.vercel.app";

    const { data: invitation, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/admin/login`,
      });

    if (inviteError) throw inviteError;

    if (!invitation.user) {
      throw new Error("The invitation did not return a user account.");
    }

    const { error: saveError } = await supabaseAdmin
      .from("site_admins")
      .upsert(
        {
          user_id: invitation.user.id,
          email,
          role: "admin",
          is_active: true,
        },
        { onConflict: "user_id" }
      );

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      message: "Administrator invitation sent successfully.",
    });
  } catch (error) {
    console.error("Administrator invitation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to invite administrator.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin || admin.role !== "owner") {
      return NextResponse.json(
        { error: "Only the owner can change administrator accounts." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userId = String(body.user_id || "").trim();
    const action = String(body.action || "").trim();

    if (!userId || !["deactivate", "reactivate"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid administrator update." },
        { status: 400 }
      );
    }

    if (userId === admin.userId) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account here." },
        { status: 400 }
      );
    }

    const { data: target, error: targetError } =
      await supabaseAdmin
        .from("site_admins")
        .select("user_id, role, is_active")
        .eq("user_id", userId)
        .maybeSingle();

    if (targetError) throw targetError;

    if (!target) {
      return NextResponse.json(
        { error: "Administrator not found." },
        { status: 404 }
      );
    }

    if (target.role === "owner") {
      return NextResponse.json(
        { error: "Owner accounts cannot be deactivated here." },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("site_admins")
      .update({ is_active: action === "reactivate" })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message:
        action === "deactivate"
          ? "Administrator deactivated."
          : "Administrator reactivated.",
    });
  } catch (error) {
    console.error("Administrator PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update administrator." },
      { status: 500 }
    );
  }
}
