
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

const allowedStatuses = [
  "new",
  "reviewing",
  "in_progress",
  "completed",
  "cancelled",
];

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
      .from("project_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ enquiries: data });
  } catch (error) {
    console.error("Admin enquiries GET error:", error);

    return NextResponse.json(
      { error: "Unable to load enquiries." },
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

    const id =
      typeof body.id === "string" ? body.id.trim() : "";

    const status =
      typeof body.status === "string" ? body.status : "";

    const admin_notes =
      typeof body.admin_notes === "string"
        ? body.admin_notes.slice(0, 5000)
        : undefined;

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required." },
        { status: 400 }
      );
    }

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid enquiry status." },
        { status: 400 }
      );
    }

    if (!status && admin_notes === undefined) {
      return NextResponse.json(
        { error: "No valid update provided." },
        { status: 400 }
      );
    }

    const updates: {
      status?: string;
      admin_notes?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    const { data, error } = await supabaseAdmin
      .from("project_enquiries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ enquiry: data });
  } catch (error) {
    console.error("Admin enquiries PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update enquiry." },
      { status: 500 }
    );
  }
}
