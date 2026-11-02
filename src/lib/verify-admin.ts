import "server-only";

import { supabaseAdmin } from "@/lib/supabase-server-admin";

export type AdminRole = "owner" | "admin";

export type VerifiedAdmin = {
  userId: string;
  email: string;
  role: AdminRole;
};

export async function verifyAdmin(
  request: Request
): Promise<VerifiedAdmin | null> {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return null;
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || !user.email) {
      return null;
    }

    const { data: admin, error: adminError } = await supabaseAdmin
      .from("site_admins")
      .select("user_id, email, role, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (adminError || !admin) {
      return null;
    }

    if (admin.email.toLowerCase() !== user.email.toLowerCase()) {
      return null;
    }

    if (admin.role !== "owner" && admin.role !== "admin") {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
}
