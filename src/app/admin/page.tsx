
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  MessageSquare,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";

type Enquiry = {
  id: string;
  status: string;
};

type AdminInfo = {
  email: string;
  role: "owner" | "admin";
};

export default function AdminOverviewPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: sessionError } =
        await supabaseBrowser.auth.getSession();

      if (sessionError) throw sessionError;

      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [verifyResponse, enquiriesResponse] = await Promise.all([
        fetch("/api/admin/verify", {
          headers,
          cache: "no-store",
        }),
        fetch("/api/admin/enquiries", {
          headers,
          cache: "no-store",
        }),
      ]);

      if (
        verifyResponse.status === 401 ||
        enquiriesResponse.status === 401
      ) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const verifyResult = await verifyResponse.json();
      const enquiriesResult = await enquiriesResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(
          verifyResult.error || "Unable to verify administrator."
        );
      }

      if (!enquiriesResponse.ok) {
        throw new Error(
          enquiriesResult.error || "Unable to load dashboard statistics."
        );
      }

      setAdmin(verifyResult.admin);
      setEnquiries(enquiriesResult.enquiries || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  const count = (status: string) =>
    enquiries.filter((item) => item.status === status).length;

  const upcomingSections = [
    {
      title: "Portfolio Management",
      description: "Add, edit and publish completed projects.",
      icon: FolderKanban,
    },
    {
      title: "Website Content",
      description: "Manage homepage, About, Services and Contact.",
      icon: Globe,
    },
    {
      title: "Media Library",
      description: "Organise website images and project media.",
      icon: ImageIcon,
    },
    {
      title: "Administrator Management",
      description: "Manage administrator accounts and permissions.",
      icon: Users,
    },
    {
      title: "Website Settings",
      description: "Manage website configuration and preferences.",
      icon: Settings,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Adigun Telecom
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboard}
              disabled={loading}
              title="Refresh dashboard"
              className="rounded-lg border border-white/20 p-2 hover:bg-white/10 disabled:opacity-50"
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
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-blue-700">
            Welcome back
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0A1830]">
            Adigun Telecom Management
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {admin ? (
              <>
                <span>{admin.email}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                  {admin.role}
                </span>
              </>
            ) : (
              <span>Verifying administrator...</span>
            )}
          </div>
        </section>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0A1830]">
              Business Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor website enquiries and management activities.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Enquiries",
              value: enquiries.length,
              icon: MessageSquare,
            },
            {
              label: "New Enquiries",
              value: count("new"),
              icon: Clock,
            },
            {
              label: "In Progress",
              value: count("in_progress"),
              icon: Eye,
            },
            {
              label: "Completed",
              value: count("completed"),
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <Icon size={19} className="text-blue-600" />
                </div>

                <p className="mt-4 text-3xl font-bold text-[#0A1830]">
                  {loading ? (
                    <Loader2 className="animate-spin" size={23} />
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <section className="mb-9">
          <h2 className="mb-4 text-xl font-bold text-[#0A1830]">
            Management Modules
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/enquiries"
              className="group rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <MessageSquare size={22} />
              </div>

              <h3 className="mt-4 font-bold text-[#0A1830]">
                Enquiry Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review client requests, update statuses and save private notes.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-700">
                Open Management →
              </p>
            </Link>

            {upcomingSections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-4 font-bold text-[#0A1830]">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {section.description}
                  </p>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Coming soon
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Adigun Telecom. Building Technology. Empowering Progress.
        </div>
      </div>
    </main>
  );
          }
      
