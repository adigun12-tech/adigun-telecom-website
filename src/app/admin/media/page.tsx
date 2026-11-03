
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  X,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

type MediaItem = {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  mime_type: string | null;
  file_size: number;
  category: string;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
};

const categories = [
  "general",
  "hero",
  "portfolio",
  "services",
  "team",
  "products",
  "gallery",
];

export default function MediaLibraryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [category, setCategory] = useState("general");
  const [altText, setAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const getToken = useCallback(async () => {
    const { data, error } =
      await supabaseBrowser.auth.getSession();

    if (error) throw error;

    const token = data.session?.access_token;

    if (!token) {
      router.replace("/admin/login");
      return null;
    }

    return token;
  }, [router]);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      if (!token) return;

      const response = await fetch("/api/admin/media", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load media library."
        );
      }

      setMedia(result.media || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load media library."
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      const matchesSearch =
        item.file_name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.alt_text || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [media, search, selectedCategory]);

  function selectFile(file?: File) {
    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, GIF or SVG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    setSelectedFile(file);
  }

  async function uploadMedia() {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();

      if (!token) return;

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("alt_text", altText);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Image upload failed.");
      }

      setSelectedFile(null);
      setAltText("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Image uploaded successfully.");
      await loadMedia();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia(item: MediaItem) {
    const confirmed = window.confirm(
      `Delete "${item.file_name}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();

      if (!token) return;

      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (response.status === 401) {
        await supabaseBrowser.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete image.");
      }

      setMedia((previous) =>
        previous.filter((mediaItem) => mediaItem.id !== item.id)
      );

      setSuccess("Image deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete image."
      );
    } finally {
      setDeletingId("");
    }
  }

  async function copyLink(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.file_url);
      setCopiedId(item.id);
      setSuccess("Public image link copied.");
    } catch {
      setError("Unable to copy link. Please copy it manually.");
    }
  }

  function formatSize(bytes: number) {
    if (!bytes) return "0 KB";

    return bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="bg-[#0A1830] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Adigun Telecom
            </p>

            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Media Library
            </h1>
          </div>

          <button
            onClick={loadMedia}
            disabled={loading}
            title="Refresh media"
            className="rounded-lg border border-white/20 p-2 hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={19}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0A1830]">
                Manage Website Media
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload, organise, preview and manage your website images.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <ImageIcon size={25} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total Images</p>
              <p className="mt-2 text-2xl font-bold text-[#0A1830]">
                {loading ? "..." : media.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Categories</p>
              <p className="mt-2 text-2xl font-bold text-[#0A1830]">
                {new Set(media.map((item) => item.category)).size}
              </p>
            </div>

            <div className="col-span-2 rounded-xl bg-slate-50 p-4 sm:col-span-1">
              <p className="text-sm text-slate-500">Storage Used</p>
              <p className="mt-2 text-2xl font-bold text-[#0A1830]">
                {formatSize(
                  media.reduce((total, item) => total + (item.file_size || 0), 0)
                )}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span>{success}</span>
            <button onClick={() => setSuccess("")}>
              <X size={17} />
            </button>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#0A1830]">
              Upload New Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              JPG, PNG, WEBP, GIF or SVG. Maximum size: 5 MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(event) =>
              selectFile(event.target.files?.[0])
            }
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5 text-center transition hover:border-blue-500 hover:bg-blue-50"
          >
            <Upload size={30} className="text-blue-700" />

            <span className="mt-3 font-semibold text-[#0A1830]">
              Choose an image to upload
            </span>

            <span className="mt-1 text-xs text-slate-500">
              Select an image from your device
            </span>
          </button>

          {selectedFile && (
            <div className="mt-5 grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Selected image preview"
                    className="h-36 w-full object-contain"
                  />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold text-[#0A1830]">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatSize(selectedFile.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    title="Remove selected image"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Category
                    </span>

                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Image description
                    </span>

                    <input
                      type="text"
                      value={altText}
                      onChange={(event) => setAltText(event.target.value)}
                      maxLength={300}
                      placeholder="Describe the image"
                      className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                </div>

                <button
                  onClick={uploadMedia}
                  disabled={uploading}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Upload Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0A1830]">
                Your Media
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredMedia.length} image(s) displayed
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search images..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <Loader2 size={30} className="animate-spin text-blue-700" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <FolderOpen
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-bold text-[#0A1830]">
                No images found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Upload an image or change your search filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMedia.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-48 items-center justify-center overflow-hidden bg-slate-100">
                    <img
                      src={item.file_url}
                      alt={item.alt_text || item.file_name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="break-all text-sm font-semibold text-[#0A1830]"
                        title={item.file_name}
                      >
                        {item.file_name}
                      </h3>

                      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold capitalize text-blue-700">
                        {item.category}
                      </span>
                    </div>

                    {item.alt_text && (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                        {item.alt_text}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{formatSize(item.file_size)}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => copyLink(item)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-2 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        {copiedId === item.id ? (
                          <Check size={15} />
                        ) : (
                          <Copy size={15} />
                        )}

                        {copiedId === item.id ? "Copied" : "Copy Link"}
                      </button>

                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open original image"
                        className="rounded-lg bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200"
                      >
                        <ExternalLink size={15} />
                      </a>

                      <button
                        onClick={() => deleteMedia(item)}
                        disabled={deletingId === item.id}
                        title="Delete image"
                        className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === item.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Adigun Telecom. Building Technology. Empowering Progress.
        </footer>
      </div>
    </main>
  );
}
 
