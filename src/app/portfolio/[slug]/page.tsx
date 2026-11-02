
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FolderKanban,
  Loader2,
  CheckCircle2,
} from "lucide-react";

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
};

export default function PortfolioProjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/portfolio?slug=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load this project."
          );
        }

        if (active) {
          setProject(result.project || null);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (slug) loadProject();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          color: "#64748b",
        }}
      >
        <Loader2 size={25} className="animate-spin" />
        Loading project...
      </main>
    );
  }

  if (error || !project) {
    return (
      <main
        className="section"
        style={{ minHeight: "65vh", textAlign: "center" }}
      >
        <div className="container">
          <FolderKanban
            size={55}
            color="#2879D8"
            style={{ margin: "0 auto 20px" }}
          />

          <h1
            style={{
              color: "#0A1830",
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            Project Not Found
          </h1>

          <p style={{ color: "#64748b", marginTop: "12px" }}>
            {error || "This project may have been removed or unpublished."}
          </p>

          <Link
            href="/portfolio"
            className="primary-button"
            style={{
              display: "inline-flex",
              marginTop: "25px",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <ArrowLeft size={18} />
            Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section
        style={{
          background: "#0A1830",
          color: "#fff",
          padding: "65px 0",
        }}
      >
        <div className="container">
          <Link
            href="/portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              color: "#a9c9f1",
              fontWeight: 700,
              marginBottom: "35px",
            }}
          >
            <ArrowLeft size={18} />
            Back to Portfolio
          </Link>

          <span
            style={{
              display: "block",
              color: "#7dbbff",
              fontSize: ".75rem",
              letterSpacing: "2px",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {project.category || "OUR PROJECT"}
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              lineHeight: 1.15,
              maxWidth: "850px",
              marginTop: "18px",
              fontWeight: 800,
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              color: "#c4d0df",
              maxWidth: "720px",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginTop: "22px",
            }}
          >
            {project.short_description || project.description}
          </p>

          <span
            style={{
              display: "inline-block",
              marginTop: "25px",
              padding: "8px 13px",
              borderRadius: "5px",
              background:
                project.completion_status === "completed"
                  ? "#14532d"
                  : "#854d0e",
              color: "#fff",
              fontSize: ".75rem",
              fontWeight: 800,
            }}
          >
            {project.completion_status === "completed"
              ? "COMPLETED PROJECT"
              : "PROJECT IN PROGRESS"}
          </span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {project.cover_image ? (
            <img
              src={project.cover_image}
              alt={project.title}
              style={{
                width: "100%",
                maxHeight: "520px",
                objectFit: "cover",
                borderRadius: "15px",
                border: "1px solid #e5ebf3",
              }}
            />
          ) : (
            <div
              style={{
                minHeight: "300px",
                borderRadius: "15px",
                background:
                  "radial-gradient(circle at 80% 20%, rgba(40,121,216,.4), transparent 45%), #0A1830",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FolderKanban
                size={75}
                color="#7dbbff"
                strokeWidth={1.3}
              />
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "45px",
              marginTop: "50px",
            }}
          >
            <div>
              <span className="section-label">PROJECT OVERVIEW</span>

              <h2
                style={{
                  color: "#0A1830",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  marginTop: "12px",
                }}
              >
                About This Project
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.9,
                  marginTop: "18px",
                  whiteSpace: "pre-line",
                }}
              >
                {project.description ||
                  project.short_description ||
                  "More information about this project will be available soon."}
              </p>
            </div>

            <aside
              style={{
                background: "#F4F7FB",
                borderRadius: "12px",
                padding: "28px",
              }}
            >
              <h3
                style={{
                  color: "#0A1830",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                }}
              >
                Project Information
              </h3>

              <div style={{ marginTop: "25px" }}>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: ".78rem",
                    fontWeight: 800,
                  }}
                >
                  CATEGORY
                </p>
                <p style={{ color: "#0A1830", marginTop: "6px" }}>
                  {project.category || "Digital Project"}
                </p>
              </div>

              <div style={{ marginTop: "22px" }}>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: ".78rem",
                    fontWeight: 800,
                  }}
                >
                  STATUS
                </p>
                <p style={{ color: "#0A1830", marginTop: "6px" }}>
                  {project.completion_status === "completed"
                    ? "Completed"
                    : "In Progress"}
                </p>
              </div>

              {project.technologies &&
                project.technologies.length > 0 && (
                  <div style={{ marginTop: "22px" }}>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: ".78rem",
                        fontWeight: 800,
                      }}
                    >
                      TECHNOLOGIES USED
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "9px",
                        marginTop: "12px",
                      }}
                    >
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#fff",
                            color: "#365575",
                            border: "1px solid #e5ebf3",
                            borderRadius: "5px",
                            padding: "7px 10px",
                            fontSize: ".78rem",
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle2
                            size={14}
                            color="#2879D8"
                          />
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    marginTop: "28px",
                  }}
                >
                  Visit Live Project
                  <ExternalLink size={17} />
                </a>
              )}
            </aside>
          </div>

          <div
            style={{
              marginTop: "60px",
              padding: "35px",
              background: "#0A1830",
              borderRadius: "14px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 800,
              }}
            >
              Have a similar project in mind?
            </h2>

            <p
              style={{
                color: "#c4d0df",
                marginTop: "12px",
                lineHeight: 1.7,
              }}
            >
              Let's discuss how Adigun Telecom can help bring
              your digital idea to life.
            </p>

            <Link
              href="/#contact"
              className="primary-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                marginTop: "22px",
              }}
            >
              Discuss Your Project
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
  }
              
