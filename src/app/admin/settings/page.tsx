"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  ArrowLeft,
  Settings,
  Save,
  Loader2,
  RefreshCw,
  Globe,
  Phone,
  Share2,
  Search,
} from "lucide-react";

type SettingsData = {
  companyName: string;
  slogan: string;
  email: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
  websiteTitle: string;
  metaDescription: string;
  maintenanceMode: boolean;
};

const initialSettings: SettingsData = {
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
};

export default function WebsiteSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

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

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const headers = await getHeaders();
      if (!headers) return;

      const response = await fetch("/api/admin/website-settings", {
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
        throw new Error(result.error || "Unable to load website settings.");
      }

      setSettings({
        ...initialSettings,
        ...(result.settings || {}),
      });

      setUpdatedAt(result.updated_at || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load website settings."
      );
    } finally {
      setLoading(false);
    }
  }, [getHeaders, router]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function updateField<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const headers = await getHeaders();
      if (!headers) return;

      const response = await fetch("/api/admin/website-settings", {
        method: "PUT",
        headers,
        body: JSON.stringify({ settings }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save website settings.");
      }

      setSuccess(result.message || "Website settings saved successfully.");
      setUpdatedAt(new Date().toISOString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save website settings."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const field = (
    label: string,
    key: keyof SettingsData,
    placeholder = "",
    type = "text"
  ) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={String(settings[key])}
        onChange={(event) =>
          updateField(key, event.target.value as SettingsData[typeof key])
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );

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
            <h1 className="text-2xl font-bold">Website Settings</h1>
            <p className="mt-1 text-sm text-blue-200">
              Manage website configuration and preferences.
            </p>
          </div>

          <Settings size={30} className="text-blue-300" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-16 text-slate-500">
            <Loader2 size={22} className="animate-spin" />
            Loading website settings...
          </div>
        ) : (
          <form onSubmit={saveSettings} className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Globe className="text-blue-700" size={22} />
                <div>
                  <h2 className="font-bold text-[#0A1830]">
                    Company Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your business identity and public contact information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {field("Company Name", "companyName")}
                {field("Company Slogan", "slogan")}
                {field("Company Email", "email", "name@example.com", "email")}
                {field("Primary Phone", "phone1")}
                {field("Secondary Phone", "phone2")}
                {field("WhatsApp Number", "whatsapp")}
                <div className="sm:col-span-2">
                  {field("Business Address", "address")}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Share2 className="text-blue-700" size={22} />
                <div>
                  <h2 className="font-bold text-[#0A1830]">
                    Social Media Links
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add your official social media profile URLs.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {field("Facebook URL", "facebook", "https://facebook.com/...")}
                {field("Instagram URL", "instagram", "https://instagram.com/...")}
                {field("LinkedIn URL", "linkedin", "https://linkedin.com/...")}
                {field("X / Twitter URL", "x", "https://x.com/...")}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Search className="text-blue-700" size={22} />
                <div>
                  <h2 className="font-bold text-[#0A1830]">
                    Search Engine Optimisation
                  </h2>
                  <p className="text-sm text-slate-500">
                    Control the default title and description for search engines.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {field("Website SEO Title", "websiteTitle")}

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Meta Description
                  </span>
                  <textarea
                    rows={4}
                    value={settings.metaDescription}
                    onChange={(event) =>
                      updateField("metaDescription", event.target.value)
                    }
                    className={inputClass}
                    maxLength={320}
                  />
                  <span className="mt-1 block text-right text-xs text-slate-400">
                    {settings.metaDescription.length}/320 characters
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-[#0A1830]">
                    Maintenance Mode
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This preference is saved, but it will not take the public
                    website offline until maintenance-mode behaviour is
                    connected to the public layout.
                  </p>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(event) =>
                      updateField("maintenanceMode", event.target.checked)
                    }
                    className="h-5 w-5 accent-blue-700"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Enable
                  </span>
                </label>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-400">
                {updatedAt
                  ? `Last saved: ${new Date(updatedAt).toLocaleString()}`
                  : "Settings have not been saved yet."}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={loadSettings}
                  disabled={loading || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw size={17} />
                  Reload
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
    }
