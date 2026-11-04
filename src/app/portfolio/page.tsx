"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  FolderKanban,
  Loader2,
  Sparkles,
} from "lucide-react";
export const metadata: Metadata = {
  title: "Our Portfolio | Adigun Telecom",
  description:
    "Explore Adigun Telecom's portfolio of websites, software applications, education technology platforms and digital projects built for businesses and organisations.",
  openGraph: {
    title: "Our Portfolio | Adigun Telecom",
    description:
      "Discover digital projects and technology solutions developed by Adigun Telecom.",
    type: "website",
  },
};

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
  display_order: number;
  created_at: string;
};

type PortfolioLogos = {
  logoUrl: string;
  logoLightUrl: string;
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [logos, setLogos] = useState<PortfolioLogos>({
    logoUrl: "",
    logoLightUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const response = await fetch("/api/portfolio", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load portfolio projects."
          );
        }

        if (active) {
          setProjects(
            Array.isArray(result.projects) ? result.projects : []
          );

          if (result.logos) {
            setLogos({
              logoUrl:
                typeof result.logos.logoUrl === "string"
                  ? result.logos.logoUrl
                  : "",
              logoLightUrl:
                typeof result.logos.logoLightUrl === "string"
                  ? result.logos.logoLightUrl
                  : "",
            });
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load portfolio projects."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      {/* HEADER */}
      <header className="site-header">
        <div className="container nav-container">
          <Link
            href="/"
            className="brand"
            aria-label="Adigun Telecom Home"
          >
            {logos.logoUrl ? (
              <img
                src={logos.logoUrl}
                alt="Adigun Telecom"
                className="h-12 w-auto max-w-[190px] object-contain"
              />
            ) : (
              <>
                <span className="brand-mark">A</span>
                <span>
                  <strong>ADIGUN</strong>
                  <small>TELECOM</small>
                </span>
              </>
            )}
          </Link>

          <nav className="desktop-nav">
            <Link href="/#home">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/products">Products</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <Link href="/contact" className="nav-cta">
            Let's Talk <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* PORTFOLIO HERO */}
      <section
        className="section"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(40,121,216,.28), transparent 35%), #0A1830",
          color: "#fff",
        }}
      >
        <div
          className="container"
          style={{
            paddingTop: "85px",
            paddingBottom: "85px",
          }}
        >
          <span className="section-label">
            OUR PORTFOLIO
          </span>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              maxWidth: "900px",
              lineHeight: 1.12,
              marginTop: "22px",
              fontWeight: 800,
            }}
          >
            Ideas into Reality.
            <br />
            <span style={{ color: "#7dbbff" }}>
              Technology in Action.
            </span>
          </h1>

          <p
            style={{
              color: "#c4d0df",
              maxWidth: "700px",
              fontSize: "1.08rem",
              marginTop: "25px",
              lineHeight: 1.9,
            }}
          >
            Explore selected projects designed, developed
            and delivered by Adigun Telecom. Each project
            represents our commitment to practical innovation,
            quality and meaningful digital solutions.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "32px",
            }}
          >
            <Link
              href="/#contact"
              className="primary-button"
              style={{ display: "inline-flex" }}
            >
              Start a Project <ArrowRight size={18} />
            </Link>

            <Link
              href="/products"
              className="secondary-button"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECT COLLECTION */}
      <section className="section">
        <div className="container">
          <div
            style={{
              marginBottom: "38px",
              maxWidth: "750px",
            }}
          >
            <span className="section-label">
              SELECTED WORK
            </span>

            <h2 className="section-title">
              Projects That Demonstrate Our Work.
            </h2>

            <p className="section-description">
              From websites and software platforms to
              education technology and business solutions,
              discover the work behind our digital innovation.
            </p>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                padding: "80px 15px",
                color: "#64748b",
              }}
            >
              <Loader2
                size={23}
                className="animate-spin"
              />
              Loading portfolio projects...
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "55px 20px",
                background: "#fff",
                border: "1px solid #fee2e2",
                borderRadius: "14px",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "75px 20px",
                background: "#F4F7FB",
                border: "1px solid #e5ebf3",
                borderRadius: "14px",
              }}
            >
              <FolderKanban
                size={48}
                color="#2879D8"
                style={{ margin: "0 auto 18px" }}
              />

              <h3
                style={{
                  color: "#0A1830",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                }}
              >
                Our Projects Are Coming Soon
              </h3>

              <p
                style={{
                  color: "#64748b",
                  maxWidth: "500px",
                  margin: "12px auto 0",
                  lineHeight: 1.8,
                }}
              >
                We are preparing our project showcase.
                Published projects will appear here.
              </p>

              <Link
                href="/#contact"
                className="primary-button"
                style={{
                  display: "inline-flex",
                  marginTop: "25px",
                }}
              >
                Work With Us <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                gap: "28px",
              }}
            >
              {projects.map((project) => (
                <article
                  key={project.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5ebf3",
                    borderRadius: "14px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    boxShadow: "0 8px 28px rgba(10,24,48,.045)",
                  }}
                >
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "245px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "245px",
                        background:
                          "radial-gradient(circle at 80% 20%, rgba(40,121,216,.4), transparent 45%), #0A1830",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FolderKanban
                        size={65}
                        color="#7dbbff"
                        strokeWidth={1.4}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      padding: "27px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        color: "#2879D8",
                        fontSize: ".72rem",
                        letterSpacing: "1.4px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {project.category || "DIGITAL PROJECT"}
                    </span>

                    <h3
                      style={{
                        color: "#0A1830",
                        fontSize: "1.4rem",
                        lineHeight: 1.35,
                        fontWeight: 800,
                        marginTop: "12px",
                      }}
                    >
                      {project.title}
                    </h3>

                    <span
                      style={{
                        alignSelf: "flex-start",
                        marginTop: "13px",
                        padding: "7px 11px",
                        borderRadius: "5px",
                        background:
                          project.completion_status === "completed"
                            ? "#e8f8ef"
                            : "#fff4df",
                        color:
                          project.completion_status === "completed"
                            ? "#167344"
                            : "#986515",
                        fontSize: ".7rem",
                        fontWeight: 800,
                      }}
                    >
                      {project.completion_status === "completed"
                        ? "COMPLETED"
                        : "IN PROGRESS"}
                    </span>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: 1.8,
                        fontSize: ".92rem",
                        marginTop: "18px",
                      }}
                    >
                      {project.short_description ||
                        project.description ||
                        "Discover this digital project by Adigun Telecom."}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "19px",
                          }}
                        >
                          {project.technologies.map((technology) => (
                            <span
                              key={technology}
                              style={{
                                padding: "6px 10px",
                                background: "#eef4fb",
                                color: "#365575",
                                borderRadius: "5px",
                                fontSize: ".72rem",
                                fontWeight: 700,
                              }}
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "18px",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "27px",
                      }}
                    >
                      <Link
                        href={`/portfolio/${encodeURIComponent(project.slug)}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "7px",
                          color: "#2879D8",
                          fontWeight: 800,
                          fontSize: ".88rem",
                        }}
                      >
                        View Project <ArrowRight size={17} />
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#64748b",
                            fontWeight: 700,
                            fontSize: ".84rem",
                          }}
                        >
                          Visit Live Site
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
            {/* PROJECT ENQUIRY */}
      <section
        className="section"
        style={{
          background: "#F4F7FB",
          textAlign: "center",
        }}
      >
        <div className="container">
          <Sparkles
            size={38}
            color="#2879D8"
          />

          <h2
            style={{
              color: "#0A1830",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginTop: "20px",
              lineHeight: 1.2,
            }}
          >
            Have a Project in Mind?
          </h2>

          <p
            style={{
              color: "#64748b",
              maxWidth: "650px",
              margin: "18px auto 0",
              lineHeight: 1.8,
            }}
          >
            Let's turn your ideas into practical digital
            solutions. Tell us what you want to build.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{
              marginTop: "30px",
              display: "inline-flex",
            }}
          >
            Discuss Your Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-main">
          <div>
            <Link
              href="/"
              className="brand footer-brand"
              aria-label="Adigun Telecom Home"
            >
              {logos.logoLightUrl || logos.logoUrl ? (
                <img
                  src={logos.logoLightUrl || logos.logoUrl}
                  alt="Adigun Telecom"
                  className="h-12 w-auto max-w-[190px] object-contain"
                />
              ) : (
                <>
                  <span className="brand-mark">A</span>
                  <span>
                    <strong>ADIGUN</strong>
                    <small>TELECOM</small>
                  </span>
                </>
              )}
            </Link>

            <p>Building Technology. Empowering Progress.</p>
          </div>

          <div className="footer-links">
            <Link href="/#home">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/products">Products</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Adigun Telecom.
          </span>

          <span>
            Building a smarter digital future.
          </span>
        </div>
      </footer>
    </main>
  );
}
