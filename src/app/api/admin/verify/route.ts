
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verify-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorised access." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authorised: true,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify administrator." },
      { status: 500 }
    );
  }
}
