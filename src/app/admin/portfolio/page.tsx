"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  Plus,
  Search,
  RefreshCw,
  LogOut,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  ImagePlus,
  ExternalLink,
  FolderKanban,
} from "lucide-react";

type GalleryImage = {
  id: string;
  image_url: string;
  display_order: number;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  technologies: string[] | null;
  cover_image: string | null;
  live_url: string | null;
  completion_status: "in_progress" | "completed";
  is_published: boolean;
  display_order: number;
  created_at: string;
  portfolio_project_images?: GalleryImage[];
};

type ProjectForm = {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  technologies: string;
  cover_image: string;
  live_url: string;
  completion_status: "in_progress" | "completed";
  is_published: boolean;
  display_order: string;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category: "",
  technologies: "",
  cover_image: "",
  live_url: "",
  completion_status: "in_progress",
  is_published: false,
  display_order: "0",
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminPortfolioPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load projects.");
      }

      setProjects(result.projects || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function updateField<K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setGalleryImages([]);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);

    setGalleryImages(
      (project.portfolio_project_images || [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((image) => image.image_url)
    );

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      short_description: project.short_description || "",
      description: project.description || "",
      category: project.category || "",
      technologies: (project.technologies || []).join(", "),
      cover_image: project.cover_image || "",
      live_url: project.live_url || "",
      completion_status: project.completion_status,
      is_published: project.is_published,
      display_order: String(project.display_order ?? 0),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function uploadCover(file: File) {
    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const { data: sessionData } =
        await supabaseBrowser.auth.getSession();

      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `covers/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabaseBrowser.storage
        .from("portfolio-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabaseBrowser.storage
        .from("portfolio-images")
        .getPublicUrl(filePath);

      updateField("cover_image", data.publicUrl);
      setSuccess("Cover image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function uploadGallery(files: FileList | null) {
    if (!files || files.length === 0) return;

    setError("");
    setSuccess("");

    const selectedFiles = Array.from(files);

    if (galleryImages.length + selectedFiles.length > 30) {
      setError("A project can have a maximum of 30 gallery images.");
      return;
    }

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setError("All selected files must be valid images.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds the 5 MB image limit.`);
        return;
      }
    }

    setUploadingGallery(true);

    try {
      const { data } = await supabaseBrowser.auth.getSession();

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `gallery/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabaseBrowser.storage
          .from("portfolio-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabaseBrowser.storage
          .from("portfolio-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicData.publicUrl);
      }

      setGalleryImages((previous) => [...previous, ...uploadedUrls]);
      setSuccess(`${uploadedUrls.length} gallery image(s) uploaded.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gallery upload failed."
      );
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const payload = {
        ...form,
        slug: makeSlug(form.slug || form.title),
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        display_order: Number(form.display_order) || 0,
        gallery_images: galleryImages,
      };

      const response = await fetch("/api/admin/portfolio", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save project.");
      }

      const wasEditing = Boolean(editingId);

      setShowForm(false);
      setForm(emptyForm);
      setGalleryImages([]);
      setEditingId(null);
      setSuccess(wasEditing ? "Project updated." : "Project created.");

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch(
        `/api/admin/portfolio?id=${encodeURIComponent(project.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete project.");
      }

      setSuccess("Project deleted successfully.");
      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete project."
      );
    }
  }

  async function togglePublish(project: Project) {
    setError("");
    setSuccess("");

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/portfolio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: project.id,
          is_published: !project.is_published,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update project.");
      }

      setSuccess(
        project.is_published
          ? "Project unpublished."
          : "Project published."
      );

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update project."
      );
    }
  }

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  const filteredProjects = projects.filter((project) =>
    [
      project.title,
      project.category || "",
      project.slug,
      ...(project.technologies || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const publishedCount = projects.filter(
    (project) => project.is_published
  ).length;

  const completedCount = projects.filter(
    (project) => project.completion_status === "completed"
  ).length;
    return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Adigun Telecom
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Portfolio Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProjects}
              disabled={loading}
              title="Refresh"
              className="rounded-lg border border-white/20 p-2 hover:bg-white/10"
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
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1830]">
              Manage Projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create, update and publish your completed and ongoing work.
            </p>
          </div>

          <button
            onClick={openNewForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0A1830] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add New Project
          </button>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Published", value: publishedCount },
            { label: "Completed", value: completedCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-bold text-[#0A1830]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {(error || success) && (
          <div
            className={`mb-5 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="mb-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, categories or technologies..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-xl bg-white py-20">
            <Loader2 size={30} className="animate-spin text-blue-600" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center">
            <FolderKanban
              size={40}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 font-semibold text-slate-700">
              No projects found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first project to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative flex h-48 items-center justify-center bg-slate-100">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={40} className="text-slate-300" />
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      project.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>

                  {(project.portfolio_project_images?.length || 0) > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                      <ImagePlus size={12} className="mr-1 inline" />
                      {project.portfolio_project_images?.length} gallery images
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#0A1830]">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.category || "Uncategorised"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        project.completion_status === "completed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {project.completion_status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {project.short_description || "No short description."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.technologies || []).slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => openEditForm(project)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#0A1830] px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => togglePublish(project)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {project.is_published ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {project.is_published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => deleteProject(project)}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete Project
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Link
          href="/admin"
          className="mt-8 inline-block text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071326]/70 p-3 sm:p-5">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-7">
              <div>
                <h3 className="text-lg font-bold text-[#0A1830]">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h3>
                <p className="text-xs text-slate-500">
                  Enter the project information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setGalleryImages([]);
                }}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProject} className="space-y-5 p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Project Title *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g. Business Website"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Category
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="Web Development"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Technologies
                  </label>
                  <input
                    value={form.technologies}
                    onChange={(e) =>
                      updateField("technologies", e.target.value)
                    }
                    placeholder="Next.js, Supabase, Tailwind"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Separate each technology with a comma.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Project Cover Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                    e.target.value = "";
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Maximum 5 MB. JPG, PNG or WebP recommended.
                </p>

                {uploading && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                    <Loader2 size={14} className="animate-spin" />
                    Uploading image...
                  </p>
                )}

                {form.cover_image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={form.cover_image}
                      alt="Project cover preview"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateField("cover_image", "")}
                      className="w-full bg-slate-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove cover image
                    </button>
                  </div>
                )}
              </div>

              {/* PROJECT IMAGE GALLERY */}
              <div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600">
                    Project Image Gallery
                  </label>
                  <p className="mt-1 text-xs text-slate-400">
                    Select multiple images to showcase different parts of
                    this project. Maximum 30 images, 5 MB each.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingGallery || galleryImages.length >= 30}
                  onChange={(e) => {
                    uploadGallery(e.target.files);
                    e.target.value = "";
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />

                {uploadingGallery && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                    <Loader2 size={14} className="animate-spin" />
                    Uploading gallery images...
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white">
                        Image {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
                        aria-label={`Remove gallery image ${index + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {galleryImages.length}/30 gallery images selected.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Live Project URL
                </label>
                <input
                  type="url"
                  value={form.live_url}
                  onChange={(e) => updateField("live_url", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Completion Status
                  </label>
                  <select
                    value={form.completion_status}
                    onChange={(e) =>
                      updateField(
                        "completion_status",
                        e.target.value as "in_progress" | "completed"
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(e) =>
                      updateField("display_order", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    updateField("is_published", e.target.checked)
                  }
                  className="h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#0A1830]">
                    Publish this project
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Published projects can appear on the public website.
                  </span>
                </span>
              </label>

              {(error || success) && (
                <div
                  className={`rounded-xl p-3 text-sm ${
                    error
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {error || success}
                </div>
              )}

                            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setGalleryImages([]);
                  }}
                  disabled={saving || uploading || uploadingGallery}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading || uploadingGallery}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0A1830] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Project"
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
