"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

type Service = {
  title: string;
  description: string;
};

type WebsiteContent = {
  hero: {
    tag: string;
    heading: string;
    highlight: string;
    description: string;
  };
  about: {
    label: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
  };
  services: {
    label: string;
    heading: string;
    description: string;
    items: Service[];
  };
  values: {
    label: string;
    heading: string;
    description: string;
    items: string[];
  };
  contact: {
    label: string;
    heading: string;
    description: string;
    phone1: string;
    phone2: string;
    email: string;
  };
};

const defaultContent: WebsiteContent = {
  hero: {
    tag: "AFRICAN TECHNOLOGY. GLOBAL POSSIBILITIES.",
    heading: "Building Technology.",
    highlight: "Empowering Progress.",
    description:
      "We develop innovative digital solutions that help businesses, schools and organisations work smarter, grow stronger and embrace the future.",
  },
  about: {
    label: "WHO WE ARE",
    heading: "Technology with purpose. Solutions with impact.",
    paragraph1:
      "Adigun Telecom is an Africa-focused technology company committed to building useful, reliable and accessible digital solutions.",
    paragraph2:
      "Our focus is to combine creativity, technology and practical thinking to solve everyday challenges for businesses and organisations, starting in Nigeria.",
  },
  services: {
    label: "WHAT WE DO",
    heading: "Technology solutions for a changing world.",
    description:
      "We focus on practical digital services that help organisations improve, adapt and move forward.",
    items: [
      {
        title: "Software Development",
        description:
          "Purpose-built digital platforms and software solutions designed around real business needs.",
      },
      {
        title: "Website Development",
        description:
          "Modern, responsive websites that help businesses establish a strong digital presence.",
      },
      {
        title: "Education Technology",
        description:
          "Digital solutions that simplify school administration, academic management and communication.",
      },
      {
        title: "Digital Design & Content",
        description:
          "Professional graphics and digital content that help brands communicate effectively.",
      },
      {
        title: "Business Digital Solutions",
        description:
          "Technology-driven solutions that improve business processes and everyday operations.",
      },
      {
        title: "Technology Consulting",
        description:
          "Practical technology guidance to help organisations identify opportunities and grow.",
      },
    ],
  },
  values: {
    label: "WHAT GUIDES US",
    heading: "Built on principles that matter.",
    description:
      "Our commitment to quality, trust and meaningful innovation shapes every solution we pursue.",
    items: [
      "Innovation",
      "Reliability",
      "Integrity",
      "Excellence",
      "Customer Focus",
      "Continuous Growth",
    ],
  },
  contact: {
    label: "LET'S BUILD SOMETHING",
    heading: "Have a challenge? Let's create a solution.",
    description:
      "Connect with Adigun Telecom to discuss your technology needs and explore possibilities.",
    phone1: "07042723692",
    phone2: "09078440739",
    email: "adiguntelecoms@gmail.com",
  },
};

function mergeContent(saved: any): WebsiteContent {
  return {
    hero: { ...defaultContent.hero, ...saved?.hero },
    about: { ...defaultContent.about, ...saved?.about },
    services: {
      ...defaultContent.services,
      ...saved?.services,
      items: Array.isArray(saved?.services?.items)
        ? saved.services.items
        : defaultContent.services.items,
    },
    values: {
      ...defaultContent.values,
      ...saved?.values,
      items: Array.isArray(saved?.values?.items)
        ? saved.values.items
        : defaultContent.values.items,
    },
    contact: { ...defaultContent.contact, ...saved?.contact },
  };
}

export default function WebsiteContentPage() {
  const router = useRouter();

  const [content, setContent] =
    useState<WebsiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function getToken() {
    const { data, error } =
      await supabaseBrowser.auth.getSession();

    if (error) throw error;

    const token = data.session?.access_token;

    if (!token) {
      router.replace("/admin/login");
      return null;
    }

    return token;
  }

  async function loadContent() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(
        "/api/admin/website-content",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load website content."
        );
      }

      setContent(mergeContent(result.content));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load website content."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateSection<
    K extends keyof WebsiteContent,
    F extends keyof WebsiteContent[K]
  >(
    section: K,
    field: F,
    value: WebsiteContent[K][F]
  ) {
    setContent((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  }

  function updateService(
    index: number,
    field: keyof Service,
    value: string
  ) {
    const items = [...content.services.items];
    items[index] = {
      ...items[index],
      [field]: value,
    };

    updateSection("services", "items", items);
  }

  function addService() {
    updateSection("services", "items", [
      ...content.services.items,
      { title: "", description: "" },
    ]);
  }

  function removeService(index: number) {
    updateSection(
      "services",
      "items",
      content.services.items.filter((_, i) => i !== index)
    );
  }

  function updateValue(index: number, value: string) {
    const items = [...content.values.items];
    items[index] = value;
    updateSection("values", "items", items);
  }

  function addValue() {
    updateSection("values", "items", [
      ...content.values.items,
      "",
    ]);
  }

  function removeValue(index: number) {
    updateSection(
      "values",
      "items",
      content.values.items.filter((_, i) => i !== index)
    );
  }

  async function saveContent() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(
        "/api/admin/website-content",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save website content."
        );
      }

      setMessage("Website content saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save website content."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#0A1830]";

  function Field({
    label,
    value,
    onChange,
    multiline = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
  }) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        {multiline ? (
          <textarea
            className={inputClass}
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <Loader2 className="animate-spin" size={22} />
          Loading website content...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center gap-2 text-xs text-blue-200 hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>

            <h1 className="text-xl font-bold sm:text-2xl">
              Website Content
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              Manage your public website information.
            </p>
          </div>

          <button
            onClick={loadContent}
            disabled={saving}
            className="rounded-lg border border-white/20 p-3 hover:bg-white/10 disabled:opacity-50"
            title="Reload content"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0A1830]">
              Homepage Hero
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The main heading and introduction visitors see first.
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="Hero Tag"
              value={content.hero.tag}
              onChange={(v) => updateSection("hero", "tag", v)}
            />
            <Field
              label="Main Heading"
              value={content.hero.heading}
              onChange={(v) => updateSection("hero", "heading", v)}
            />
            <Field
              label="Highlighted Heading"
              value={content.hero.highlight}
              onChange={(v) => updateSection("hero", "highlight", v)}
            />
            <Field
              label="Hero Description"
              multiline
              value={content.hero.description}
              onChange={(v) =>
                updateSection("hero", "description", v)
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0A1830]">
              About Section
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your company introduction.
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="Section Label"
              value={content.about.label}
              onChange={(v) => updateSection("about", "label", v)}
            />
            <Field
              label="Heading"
              value={content.about.heading}
              onChange={(v) => updateSection("about", "heading", v)}
            />
            <Field
              label="First Paragraph"
              multiline
              value={content.about.paragraph1}
              onChange={(v) =>
                updateSection("about", "paragraph1", v)
              }
            />
            <Field
              label="Second Paragraph"
              multiline
              value={content.about.paragraph2}
              onChange={(v) =>
                updateSection("about", "paragraph2", v)
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0A1830]">
              Services Section
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Edit your services and their descriptions.
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="Section Label"
              value={content.services.label}
              onChange={(v) => updateSection("services", "label", v)}
            />
            <Field
              label="Section Heading"
              value={content.services.heading}
              onChange={(v) =>
                updateSection("services", "heading", v)
              }
            />
            <Field
              label="Section Description"
              multiline
              value={content.services.description}
              onChange={(v) =>
                updateSection("services", "description", v)
              }
            />

            <div className="space-y-4 pt-3">
              {content.services.items.map((service, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0A1830]">
                      Service {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Remove service"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Field
                      label="Service Title"
                      value={service.title}
                      onChange={(v) =>
                        updateService(index, "title", v)
                      }
                    />
                    <Field
                      label="Service Description"
                      multiline
                      value={service.description}
                      onChange={(v) =>
                        updateService(index, "description", v)
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addService}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Plus size={17} />
                Add Service
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0A1830]">
              Company Values
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage the principles that guide your company.
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="Section Label"
              value={content.values.label}
              onChange={(v) => updateSection("values", "label", v)}
            />
            <Field
              label="Heading"
              value={content.values.heading}
              onChange={(v) => updateSection("values", "heading", v)}
            />
            <Field
              label="Description"
              multiline
              value={content.values.description}
              onChange={(v) =>
                updateSection("values", "description", v)
              }
            />

            <div className="space-y-3">
              {content.values.items.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={value}
                    onChange={(e) =>
                      updateValue(index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="rounded-lg p-3 text-red-600 hover:bg-red-50"
                    title="Remove value"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Plus size={17} />
                Add Company Value
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0A1830]">
              Contact Section
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your public contact information.
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="Section Label"
              value={content.contact.label}
              onChange={(v) => updateSection("contact", "label", v)}
            />
            <Field
              label="Heading"
              value={content.contact.heading}
              onChange={(v) => updateSection("contact", "heading", v)}
            />
            <Field
              label="Description"
              multiline
              value={content.contact.description}
                              onChange={(v) =>
                  updateSection("contact", "description", v)
                }
              />
              <Field
                label="First Phone Number"
                value={content.contact.phone1}
                onChange={(v) =>
                  updateSection("contact", "phone1", v)
                }
              />
              <Field
                label="Second Phone Number"
                value={content.contact.phone2}
                onChange={(v) =>
                  updateSection("contact", "phone2", v)
                }
              />
              <Field
                label="Email Address"
                value={content.contact.email}
                onChange={(v) =>
                  updateSection("contact", "email", v)
                }
              />
            </div>
          </section>

          <div className="sticky bottom-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Save your changes to the website content database.
            </p>

            <button
              onClick={saveContent}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1830] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
            </main>
    );
}
