
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { LockKeyhole, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } =
        await supabaseBrowser.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) throw error;

      if (
        data.user?.email?.toLowerCase() !==
        process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()
      ) {
        await supabaseBrowser.auth.signOut();
        throw new Error("You are not authorised to access the admin dashboard.");
      }

      router.replace("/admin/enquiries");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A1830] text-white">
            <LockKeyhole size={30} />
          </div>

          <h1 className="text-2xl font-bold text-[#0A1830]">
            Admin Portal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Adigun Telecom Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Administrator Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1830] py-3.5 font-semibold text-white transition hover:bg-[#2879D8] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In Securely"
            )}
          </button>
        </form>
        <div className="mt-5 text-center">
  <Link
    href="/admin/forgot-password"
    className="text-sm font-semibold text-blue-700 hover:underline"
  >
    Forgot your password?
  </Link>
</div>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Adigun Telecom
        </p>
      </div>
    </main>
  );
            }
