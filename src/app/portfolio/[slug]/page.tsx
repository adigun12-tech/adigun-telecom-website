
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import PortfolioProjectClient from "./PortfolioProjectClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = "https://adiguntelecom.com.ng";

type PortfolioProject = {
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
  created_at: string;
  portfolio_project_images?: {
    id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
  }[];
};

async function getProject(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("portfolio_projects")
    .select(`
      id,
      title,
      slug,
      short_description,
      description,
      category,
      technologies,
      cover_image,
      live_url,
      completion_status,
      created_at,
      portfolio_project_images (
        id,
        image_url,
        alt_text,
        display_order
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Portfolio project fetch error:", error);
    throw new Error("Unable to load portfolio project.");
  }

  if (!data) return null;

  const project = data as PortfolioProject;

  project.portfolio_project_images = [
    ...(project.portfolio_project_images || []),
  ].sort((a, b) => a.display_order - b.display_order);

  return project;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Adigun Telecom",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${project.title} | Adigun Telecom`;

  const description =
    project.short_description ||
    project.description?.slice(0, 155) ||
    `Explore the ${project.title} project by Adigun Telecom.`;

  const canonicalUrl =
    `${SITE_URL}/portfolio/${encodeURIComponent(project.slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: "Adigun Telecom",
      title,
      description,
      images: project.cover_image
        ? [
            {
              url: project.cover_image,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: project.cover_image
        ? "summary_large_image"
        : "summary",
      title,
      description,
      images: project.cover_image
        ? [project.cover_image]
        : [],
    },
  };
}

export default async function PortfolioProjectPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return <PortfolioProjectClient initialProject={project} />;
      }
