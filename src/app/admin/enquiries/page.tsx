
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  supabaseBrowser,
} from "@/lib/supabase-browser";
import {
  Search,
  RefreshCw,
  LogOut,
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
} from "lucide-react";

type Enquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  budget: string | null;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const statuses = [
  "new",
  "reviewing",
  "in_progress",
  "completed",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminEnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/enquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load enquiries.");
      }

      setEnquiries(result.enquiries || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  async function updateEnquiry(
    id: string,
    updates: { status?: string; admin_notes?: string }
  ) {
    setSaving(true);
    setError("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed.");
      }

      setEnquiries((previous) =>
        previous.map((item) =>
          item.id === id ? result.enquiry : item
        )
      );

      setSelected(result.enquiry);
      setNotes(result.enquiry.admin_notes || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update enquiry."
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  function openEnquiry(enquiry: Enquiry) {
    setSelected(enquiry);
    setNotes(enquiry.admin_notes || "");
  }

  const filtered = enquiries.filter((item) => {
    const matchesFilter =
      filter === "all" || item.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch = [
      item.full_name,
      item.email,
      item.phone,
      item.company || "",
      item.service,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const count = (status: string) =>
    enquiries.filter((item) => item.status === status).length;

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Adigun Telecom
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Enquiry Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadEnquiries}
              disabled={loading}
              className="rounded-lg border border-white/20 p-2 hover:bg-white/10"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-[#0A1830]">
            Project Enquiries
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage incoming client requests.
          </p>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: "Total",
              value: enquiries.length,
              icon: MessageSquare,
            },
            { label: "New", value: count("new"), icon: Clock },
            {
              label: "Reviewing",
              value: count("reviewing"),
              icon: Eye,
            },
            {
              label: "Completed",
              value: count("completed"),
              icon: CheckCircle2,
            },
            {
              label: "Cancelled",
              value: count("cancelled"),
              icon: XCircle,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <Icon size={17} className="text-blue-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-[#0A1830]">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or service..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center rounded-xl bg-white py-20">
            <Loader2 className="animate-spin text-blue-600" size={30} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center">
            <MessageSquare
              className="mx-auto text-slate-300"
              size={38}
            />
            <p className="mt-3 font-semibold text-slate-700">
              No enquiries found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New project submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0A1830]">
                          {item.full_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.service}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {statusLabels[item.status] || item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => openEnquiry(item)}
                          className="rounded-lg bg-[#0A1830] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-5 text-xs text-slate-400">
          Showing {filtered.length} of {enquiries.length} enquiries
        </p>

        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Back to website
        </Link>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071326]/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-[#0A1830]">
                  Enquiry Details
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Client", selected.full_name],
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Company", selected.company || "Not provided"],
                  ["Service", selected.service],
                  ["Budget", selected.budget || "Not provided"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Project Description
                </p>
                <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selected.description}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                  Enquiry Status
                </label>

                <select
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) =>
                    updateEnquiry(selected.id, {
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                  Private Admin Notes
                </label>

                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={5000}
                  placeholder="Add internal notes about this enquiry..."
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500"
                />

                <button
                  onClick={() =>
                    updateEnquiry(selected.id, {
                      admin_notes: notes,
                    })
                  }
                  disabled={saving}
                  className="mt-3 flex items-center gap-2 rounded-xl bg-[#0A1830] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
            }
              
