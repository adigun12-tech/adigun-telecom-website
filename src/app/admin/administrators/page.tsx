"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  ArrowLeft,
  Users,
  UserPlus,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Shield,
  Mail,
  Power,
} from "lucide-react";

type Administrator = {
  user_id: string;
  email: string;
  role: "owner" | "admin";
  is_active: boolean;
};

export default function AdministratorsPage() {
  const router = useRouter();

  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [currentRole, setCurrentRole] = useState<"owner" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getHeaders = useCallback(async () => {
    const { data, error } = await supabaseBrowser.auth.getSession();

    if (error) throw error;

    const token = data.session?.access_token;

    if (!token) {
      router.replace("/admin/login");
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [router]);

  const loadAdministrators = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const headers = await getHeaders();
      if (!headers) return;

      const response = await fetch("/api/admin/administrators", {
        headers,
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Unable to load administrators.");
      }

      setAdministrators(result.administrators || []);
      setCurrentRole(result.currentAdmin?.role || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load administrators."
      );
    } finally {
      setLoading(false);
    }
  }, [getHeaders, router]);

  useEffect(() => {
    loadAdministrators();
  }, [loadAdministrators]);

  async function inviteAdministrator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const headers = await getHeaders();
      if (!headers) return;

      const response = await fetch("/api/admin/administrators", {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to invite administrator.");
      }

      setEmail("");
      setSuccess(result.message || "Invitation sent.");
      await loadAdministrators();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to invite administrator."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(item: Administrator) {
    const action = item.is_active ? "deactivate" : "reactivate";

    const confirmed = window.confirm(
      `${action === "deactivate" ? "Deactivate" : "Reactivate"} ${item.email}?`
    );

    if (!confirmed) return;

    setWorkingId(item.user_id);
    setError("");
    setSuccess("");

    try {
      const headers = await getHeaders();
      if (!headers) return;

      const response = await fetch("/api/admin/administrators", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          user_id: item.user_id,
          action,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update administrator.");
      }

      setSuccess(result.message || "Administrator updated.");
      await loadAdministrators();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update administrator."
      );
    } finally {
      setWorkingId("");
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Administrator Management</h1>
            <p className="mt-1 text-sm text-blue-200">
              Manage administrator accounts and permissions.
            </p>
          </div>

          <Users size={30} className="text-blue-300" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {currentRole === "owner" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <UserPlus size={22} />
              </div>
              <div>
                <h2 className="font-bold text-[#0A1830]">
                  Invite an Administrator
                </h2>
                <p className="text-sm text-slate-500">
                  An invitation email will be sent to the new administrator.
                </p>
              </div>
            </div>

            <form
              onSubmit={inviteAdministrator}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="administrator@example.com"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Mail size={17} />
                )}
                Send Invitation
              </button>
            </form>

            <p className="mt-3 text-xs text-slate-400">
              New invitations receive the standard admin role. Only the owner
              can manage administrator accounts.
            </p>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-[#0A1830]">
                Registered Administrators
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {administrators.length} account(s)
              </p>
            </div>

            <button
              onClick={loadAdministrators}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
              <Loader2 size={20} className="animate-spin" />
              Loading administrators...
            </div>
          ) : administrators.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No administrator accounts found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {administrators.map((item) => (
                <div
                  key={item.user_id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                      {item.role === "owner" ? (
                        <ShieldCheck size={21} />
                      ) : (
                        <Shield size={21} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="break-all font-semibold text-[#0A1830]">
                        {item.email}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                          {item.role}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentRole === "owner" && item.role !== "owner" && (
                    <button
                      onClick={() => changeStatus(item)}
                      disabled={workingId === item.user_id}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                        item.is_active
                          ? "border border-red-200 text-red-700 hover:bg-red-50"
                          : "border border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {workingId === item.user_id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Power size={16} />
                      )}
                      {item.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-400">
          Owner accounts are protected from deactivation through this page.
          Administrator access is checked by the server on every management
          request.
        </p>
      </div>
    </main>
  );
}
