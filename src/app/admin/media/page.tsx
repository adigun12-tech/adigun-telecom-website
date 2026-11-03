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
  ChevronUp,
  ChevronDown,
  Images,
  Eye,
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

type SlideshowSettings = {
  enabled: boolean;
  mediaIds: string[];
  interval: number;
  transition: "fade" | "slide";
  showArrows: boolean;
  showDots: boolean;
  imageFit: "contain" | "cover";
};

type MediaSlideshowSettings = {
  hero: SlideshowSettings;
  portfolio: SlideshowSettings;
};

const defaultSlideshowSettings: MediaSlideshowSettings = {
  hero: {
    enabled: false,
    mediaIds: [],
    interval: 5,
    transition: "fade",
    showArrows: true,
    showDots: true,
    imageFit: "contain",
  },
  portfolio: {
    enabled: false,
    mediaIds: [],
    interval: 5,
    transition: "slide",
    showArrows: true,
    showDots: true,
    imageFit: "cover",
  },
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

type SlideshowName = "hero" | "portfolio";

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

  const [slideshowSettings, setSlideshowSettings] =
    useState<MediaSlideshowSettings>(defaultSlideshowSettings);

  const [loadingSlideshow, setLoadingSlideshow] = useState(true);
  const [savingSlideshow, setSavingSlideshow] = useState(false);
  const [activeSlideshow, setActiveSlideshow] =
    useState<SlideshowName>("hero");

  const [previewIndices, setPreviewIndices] = useState({
    hero: 0,
    portfolio: 0,
  });

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

  const handleUnauthorized = useCallback(async () => {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
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
        await handleUnauthorized();
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
  }, [getToken, handleUnauthorized]);

  const loadSlideshowSettings = useCallback(async () => {
    setLoadingSlideshow(true);

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch("/api/admin/website-content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load slideshow settings."
        );
      }

      const saved = result.content?.slideshows || {};

      const normalise = (
        name: SlideshowName
      ): SlideshowSettings => {
        const defaults = defaultSlideshowSettings[name];
        const value = saved[name] || {};

        return {
          ...defaults,
          ...value,
          mediaIds: Array.isArray(value.mediaIds)
            ? value.mediaIds.filter(
                (id: unknown): id is string =>
                  typeof id === "string"
              )
            : [],
          interval: Math.min(
            30,
            Math.max(2, Number(value.interval) || defaults.interval)
          ),
          transition:
            value.transition === "slide" ? "slide" : "fade",
          enabled: Boolean(value.enabled),
          showArrows:
            value.showArrows !== undefined
              ? Boolean(value.showArrows)
              : defaults.showArrows,
          showDots:
            value.showDots !== undefined
              ? Boolean(value.showDots)
              : defaults.showDots,
          imageFit: value.imageFit === "cover" ? "cover" : "contain",
        };
      };

      setSlideshowSettings({
        hero: normalise("hero"),
        portfolio: normalise("portfolio"),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load slideshow settings."
      );
    } finally {
      setLoadingSlideshow(false);
    }
  }, [getToken, handleUnauthorized]);

  useEffect(() => {
    void loadMedia();
    void loadSlideshowSettings();
  }, [loadMedia, loadSlideshowSettings]);

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

  const updateSlideshow = useCallback(
    (
      name: SlideshowName,
      updates: Partial<SlideshowSettings>
    ) => {
      setSlideshowSettings((previous) => ({
        ...previous,
        [name]: {
          ...previous[name],
          ...updates,
        },
      }));
    },
    []
  );

  const toggleSlideshowImage = useCallback(
    (name: SlideshowName, mediaId: string) => {
      setSlideshowSettings((previous) => {
        const current = previous[name];
        const exists = current.mediaIds.includes(mediaId);

        return {
          ...previous,
          [name]: {
            ...current,
            mediaIds: exists
              ? current.mediaIds.filter((id) => id !== mediaId)
              : [...current.mediaIds, mediaId],
          },
        };
      });
    },
    []
  );

  const moveSlideshowImage = useCallback(
    (
      name: SlideshowName,
      index: number,
      direction: -1 | 1
    ) => {
      setSlideshowSettings((previous) => {
        const ids = [...previous[name].mediaIds];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= ids.length) {
          return previous;
        }

        [ids[index], ids[newIndex]] = [
          ids[newIndex],
          ids[index],
        ];

        return {
          ...previous,
          [name]: {
            ...previous[name],
            mediaIds: ids,
          },
        };
      });
    },
    []
  );

  const saveSlideshowSettings = useCallback(async () => {
    setSavingSlideshow(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();
      if (!token) return;

      // Load the latest content first so other website settings
      // are not accidentally overwritten.
      const getResponse = await fetch("/api/admin/website-content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (getResponse.status === 401) {
        await handleUnauthorized();
        return;
      }

      const currentResult = await getResponse.json();

      if (!getResponse.ok) {
        throw new Error(
          currentResult.error || "Unable to retrieve website content."
        );
      }

      const currentContent =
        currentResult.content &&
        typeof currentResult.content === "object" &&
        !Array.isArray(currentResult.content)
          ? currentResult.content
          : {};

      const updatedContent = {
        ...currentContent,
        slideshows: slideshowSettings,
      };

      const response = await fetch("/api/admin/website-content", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: updatedContent,
        }),
      });

      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save slideshow settings."
        );
      }

      setSuccess("Slideshow settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save slideshow settings."
      );
    } finally {
      setSavingSlideshow(false);
    }
  }, [getToken, handleUnauthorized, slideshowSettings]);

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
        await handleUnauthorized();
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
        await handleUnauthorized();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete image.");
      }

      setMedia((previous) =>
        previous.filter((mediaItem) => mediaItem.id !== item.id)
      );

      // Remove deleted image from both slideshow selections.
      setSlideshowSettings((previous) => ({
        hero: {
          ...previous.hero,
          mediaIds: previous.hero.mediaIds.filter(
            (id) => id !== item.id
          ),
        },
        portfolio: {
          ...previous.portfolio,
          mediaIds: previous.portfolio.mediaIds.filter(
            (id) => id !== item.id
          ),
        },
      }));

      setSuccess(
        "Image deleted. Save slideshow settings if it was selected."
      );
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

  const activeSettings = slideshowSettings[activeSlideshow];

  const activeSlides = activeSettings.mediaIds
    .map((id) => media.find((item) => item.id === id))
    .filter((item): item is MediaItem => Boolean(item));

  const previewIndex = Math.min(
    previewIndices[activeSlideshow],
    Math.max(0, activeSlides.length - 1)
  );

  const previewImage = activeSlides[previewIndex];

  function changePreview(direction: -1 | 1) {
    if (activeSlides.length < 2) return;

    setPreviewIndices((previous) => ({
      ...previous,
      [activeSlideshow]:
        (previewIndex + direction + activeSlides.length) %
        activeSlides.length,
    }));
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
            onClick={() => {
              void loadMedia();
              void loadSlideshowSettings();
            }}
            disabled={loading || loadingSlideshow}
            title="Refresh media and slideshow settings"
            className="rounded-lg border border-white/20 p-2 hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={19}
              className={
                loading || loadingSlideshow ? "animate-spin" : ""
              }
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
                  media.reduce(
                    (total, item) => total + (item.file_size || 0),
                    0
                  )
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

        {/* SLIDESHOW MANAGEMENT */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Images size={22} className="text-blue-700" />
                <h2 className="text-xl font-bold text-[#0A1830]">
                  Homepage Slideshows
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Select, arrange and configure the images displayed on your website.
              </p>
            </div>

            <button
              onClick={saveSlideshowSettings}
              disabled={savingSlideshow || loadingSlideshow}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {savingSlideshow ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Save Slideshow Settings
                </>
              )}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveSlideshow("hero")}
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                activeSlideshow === "hero"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-[#0A1830]"
              }`}
            >
              Homepage Hero
            </button>

            <button
              onClick={() => setActiveSlideshow("portfolio")}
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                activeSlideshow === "portfolio"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-[#0A1830]"
              }`}
            >
              Portfolio / Gallery
            </button>
          </div>

          {loadingSlideshow ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-blue-700" />
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-[#0A1830]">
                        {activeSlideshow === "hero"
                          ? "Hero Slideshow"
                          : "Portfolio Slideshow"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {activeSlideshow === "hero"
                          ? "Images displayed in the homepage hero area."
                          : "Images displayed in the homepage portfolio area."}
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={activeSettings.enabled}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            enabled: event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-blue-700"
                      />
                      Enabled
                    </label>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Autoplay interval
                      </span>

                      <select
                        value={activeSettings.interval}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            interval: Number(event.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                      >
                        {[2, 3, 4, 5, 6, 8, 10, 15, 20, 30].map(
                          (seconds) => (
                            <option key={seconds} value={seconds}>
                              {seconds} seconds
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Transition style
                      </span>

                      <select
                        value={activeSettings.transition}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            transition: event.target.value as
                              | "fade"
                              | "slide",
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Image display
                      </span>

                      <select
                        value={activeSettings.imageFit}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            imageFit: event.target.value as
                              | "contain"
                              | "cover",
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="contain">
                          Fit — show the complete image
                        </option>
                        <option value="cover">
                          Fill — cover the frame
                        </option>
                      </select>

                      <span className="mt-2 block text-xs leading-5 text-slate-500">
                        Fit avoids cropping. Fill covers the landscape frame
                        but may crop parts of portrait or differently sized images.
                      </span>
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5 rounded-xl bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={activeSettings.showArrows}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            showArrows: event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-blue-700"
                      />
                      Show arrows
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={activeSettings.showDots}
                        onChange={(event) =>
                          updateSlideshow(activeSlideshow, {
                            showDots: event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-blue-700"
                      />
                      Show navigation dots
                    </label>
                  </div>
                                    <div className="mt-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-[#0A1830]">
                        Select Images
                      </h3>

                      <span className="text-xs text-slate-500">
                        {activeSettings.mediaIds.length} selected
                      </span>
                    </div>

                    {media.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                        Upload images to the Media Library first.
                      </div>
                    ) : (
                      <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-slate-200 p-3 sm:grid-cols-3">
                        {media.map((item) => {
                          const selected =
                            activeSettings.mediaIds.includes(item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                toggleSlideshowImage(
                                  activeSlideshow,
                                  item.id
                                )
                              }
                              className={`overflow-hidden rounded-lg border-2 text-left transition ${
                                selected
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-slate-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="relative h-24 bg-slate-100">
                                <img
                                  src={item.file_url}
                                  alt={item.alt_text || item.file_name}
                                  className="h-full w-full object-cover"
                                />

                                <span
                                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                    selected
                                      ? "bg-blue-700 text-white"
                                      : "bg-white/90 text-slate-500"
                                  }`}
                                >
                                  {selected ? (
                                    <Check size={14} />
                                  ) : (
                                    "+"
                                  )}
                                </span>
                              </div>

                              <div className="p-2">
                                <p className="truncate text-xs font-semibold text-[#0A1830]">
                                  {item.file_name}
                                </p>
                                <p className="mt-1 text-[10px] capitalize text-slate-500">
                                  {item.category}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[#0A1830]">
                      Live Preview
                    </h3>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Eye size={14} />
                      Preview selected images
                    </span>
                  </div>

                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#0A1830]">
                    {previewImage ? (
                      <>
                        <img
                          src={previewImage.file_url}
                          alt={previewImage.alt_text || previewImage.file_name}
                          className={`h-full w-full ${
                            activeSettings.imageFit === "cover"
                              ? "object-cover"
                              : "object-contain"
                          }`}
                        />

                        {activeSettings.showArrows &&
                          activeSlides.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => changePreview(-1)}
                                title="Previous image"
                                className="absolute left-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                              >
                                <ChevronUp
                                  size={20}
                                  className="-rotate-90"
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() => changePreview(1)}
                                title="Next image"
                                className="absolute right-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                              >
                                <ChevronDown
                                  size={20}
                                  className="-rotate-90"
                                />
                              </button>
                            </>
                          )}

                        {activeSettings.showDots &&
                          activeSlides.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                              {activeSlides.map((slide, index) => (
                                <button
                                  key={slide.id}
                                  type="button"
                                  onClick={() =>
                                    setPreviewIndices((previous) => ({
                                      ...previous,
                                      [activeSlideshow]: index,
                                    }))
                                  }
                                  title={`Preview image ${index + 1}`}
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    index === previewIndex
                                      ? "bg-white"
                                      : "bg-white/50"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-5 text-center text-white">
                        <ImageIcon
                          size={38}
                          className="mx-auto text-blue-300"
                        />
                        <p className="mt-3 font-semibold">
                          No images selected
                        </p>
                        <p className="mt-1 text-xs text-blue-200">
                          Select images to see your slideshow preview.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="mb-3 font-bold text-[#0A1830]">
                      Selected Image Order
                    </h3>

                    {activeSlides.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        Your selected images will appear here.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {activeSlides.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-2"
                          >
                            <span className="w-6 text-center text-xs font-bold text-slate-500">
                              {index + 1}
                            </span>

                            <img
                              src={item.file_url}
                              alt={item.alt_text || item.file_name}
                              className="h-12 w-16 rounded-lg bg-slate-100 object-cover"
                            />

                            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[#0A1830]">
                              {item.file_name}
                            </p>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() =>
                                  moveSlideshowImage(
                                    activeSlideshow,
                                    index,
                                    -1
                                  )
                                }
                                title="Move up"
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ChevronUp size={17} />
                              </button>

                              <button
                                type="button"
                                disabled={index === activeSlides.length - 1}
                                onClick={() =>
                                  moveSlideshowImage(
                                    activeSlideshow,
                                    index,
                                    1
                                  )
                                }
                                title="Move down"
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ChevronDown size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleSlideshowImage(
                                    activeSlideshow,
                                    item.id
                                  )
                                }
                                title="Remove from slideshow"
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              >
                                <X size={17} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-800">
                    <strong>Note:</strong> These settings are stored separately
                    for the homepage hero and portfolio slideshow. Remember to
                    save after changing your selections or settings.
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ORIGINAL IMAGE UPLOAD */}
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

        {/* ORIGINAL MEDIA LIBRARY */}
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
