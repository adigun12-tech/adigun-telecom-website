
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Building2,
  Code2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  FolderKanban,
  Loader2,
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
  display_order: number;
  created_at: string;
};

const products = [
  {
    number: "01",
    icon: GraduationCap,
    name: "Adigun SchoolSuite",
    category: "EDUCATION TECHNOLOGY",
    status: "Flagship Product",
    description:
      "A modern school management platform designed to simplify academic administration, improve communication and connect schools, teachers, parents and students.",
    features: [
      "Student and staff management",
      "Attendance and academic records",
      "Digital report cards",
      "Parent and student portals",
      "School administration tools",
    ],
    href: "/#contact",
  },
  {
    number: "02",
    icon: Building2,
    name: "Business Management Solutions",
    category: "BUSINESS TECHNOLOGY",
    status: "Custom Solutions",
    description:
      "Digital business tools designed to help organisations streamline operations, manage information and improve productivity.",
    features: [
      "Business management systems",
      "Digital record management",
      "Workflow improvement",
      "Custom business platforms",
    ],
    href: "/#contact",
  },
  {
    number: "03",
    icon: Code2,
    name: "Custom Software Products",
    category: "SOFTWARE DEVELOPMENT",
    status: "Project-Based",
    description:
      "Purpose-built software applications developed around specific business challenges, operational needs and digital opportunities.",
    features: [
      "Custom web applications",
      "Database-driven platforms",
      "Digital service applications",
      "Tailored software solutions",
    ],
    href: "/#contact",
  },
];

export default function ProductsPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

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
            result.error || "Unable to load projects."
          );
        }

        if (active) {
          setProjects(
            Array.isArray(result.projects) ? result.projects : []
          );
        }
      } catch (error) {
        if (active) {
          setProjectsError(
            error instanceof Error
              ? error.message
              : "Unable to load projects."
          );
        }
      } finally {
        if (active) setLoadingProjects(false);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      <section
        className="section"
        style={{ background: "#0A1830", color: "#fff" }}
      >
        <div
          className="container"
          style={{ paddingTop: "70px", paddingBottom: "70px" }}
        >
          <span className="section-label">OUR PRODUCTS</span>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              maxWidth: "850px",
              lineHeight: 1.15,
              marginTop: "20px",
            }}
          >
            Technology Products.
            <br />
            Solutions for Progress.
          </h1>

          <p
            style={{
              color: "#c4d0df",
              maxWidth: "680px",
              fontSize: "1.08rem",
              marginTop: "24px",
              lineHeight: 1.8,
            }}
          >
            Discover digital products and software solutions
            being developed to help businesses and organisations
            work smarter and achieve more.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{ marginTop: "30px", display: "inline-flex" }}
          >
            Discuss a Product <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* EXISTING PRODUCTS */}
      <section className="section">
        <div className="container">
          <span className="section-label">THE ADIGUN ECOSYSTEM</span>

          <h2 className="section-title">
            Digital Solutions Built for Real Needs.
          </h2>

          <p className="section-description">
            We focus on creating useful technology products
            that address practical challenges across different
            sectors.
          </p>

          <div
            style={{
              display: "grid",
              gap: "28px",
              marginTop: "45px",
            }}
          >
            {products.map((product) => {
              const Icon = product.icon;

              return (
                <article
                  key={product.number}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    border: "1px solid #e5ebf3",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      background:
                        "radial-gradient(circle at 80% 20%, rgba(40,121,216,.35), transparent 45%), #0A1830",
                      minHeight: "260px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "35px",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    <Icon size={65} color="#7dbbff" strokeWidth={1.5} />

                    <span
                      style={{
                        marginTop: "24px",
                        fontSize: ".72rem",
                        letterSpacing: "2px",
                        color: "#a9c9f1",
                        fontWeight: 800,
                      }}
                    >
                      ADIGUN TELECOM
                    </span>

                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        marginTop: "8px",
                      }}
                    >
                      {product.number}
                    </span>
                  </div>

                  <div style={{ padding: "35px" }}>
                    <span
                      style={{
                        color: "#2879D8",
                        fontSize: ".7rem",
                        letterSpacing: "1.5px",
                        fontWeight: 800,
                      }}
                    >
                      {product.category}
                    </span>

                    <h2
                      style={{
                        color: "#0A1830",
                        fontSize: "1.7rem",
                        lineHeight: 1.25,
                        marginTop: "12px",
                      }}
                    >
                      {product.name}
                    </h2>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "13px",
                        padding: "7px 11px",
                        background: "#eaf3ff",
                        color: "#2365ac",
                        borderRadius: "5px",
                        fontSize: ".72rem",
                        fontWeight: 800,
                      }}
                    >
                      {product.status}
                    </span>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: 1.8,
                        marginTop: "18px",
                      }}
                    >
                      {product.description}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        marginTop: "22px",
                      }}
                    >
                      {product.features.map((feature) => (
                        <div
                          key={feature}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "#334155",
                            fontSize: ".88rem",
                          }}
                        >
                          <CheckCircle2
                            size={17}
                            color="#2879D8"
                            style={{ flexShrink: 0 }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link
                      href={product.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "9px",
                        color: "#2879D8",
                        fontWeight: 800,
                        marginTop: "27px",
                      }}
                    >
                      Make an Enquiry <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC FEATURED PROJECTS */}
      <section
        className="section"
        style={{ background: "#F4F7FB" }}
      >
        <div className="container">
          <span className="section-label">OUR PORTFOLIO</span>

          <h2 className="section-title">
            Featured Projects.
          </h2>

          <p className="section-description">
            Explore selected digital projects and solutions
            created by Adigun Telecom.
          </p>

          {loadingProjects ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                padding: "65px 15px",
                color: "#64748b",
              }}
            >
              <Loader2 size={22} className="animate-spin" />
              Loading featured projects...
            </div>
          ) : projectsError ? (
            <p
              style={{
                textAlign: "center",
                color: "#b91c1c",
                padding: "45px 15px",
              }}
            >
              {projectsError}
            </p>
          ) : projects.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "55px 20px",
                marginTop: "35px",
                background: "#fff",
                border: "1px solid #e5ebf3",
                borderRadius: "14px",
              }}
            >
              <FolderKanban
                size={42}
                color="#2879D8"
                style={{ margin: "0 auto 15px" }}
              />

              <h3
                style={{
                  color: "#0A1830",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                }}
              >
                Projects Coming Soon
              </h3>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "10px",
                  lineHeight: 1.7,
                }}
              >
                Our featured projects will appear here as they
                are published.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "25px",
                marginTop: "40px",
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
                  }}
                >
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "220px",
                        background:
                          "radial-gradient(circle at 80% 20%, rgba(40,121,216,.4), transparent 45%), #0A1830",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FolderKanban
                        size={58}
                        color="#7dbbff"
                        strokeWidth={1.4}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        color: "#2879D8",
                        fontSize: ".7rem",
                        letterSpacing: "1.3px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {project.category || "DIGITAL PROJECT"}
                    </span>

                    <h3
                      style={{
                        color: "#0A1830",
                        fontSize: "1.3rem",
                        lineHeight: 1.35,
                        fontWeight: 800,
                        marginTop: "10px",
                      }}
                    >
                      {project.title}
                    </h3>

                    <span
                      style={{
                        alignSelf: "flex-start",
                        marginTop: "12px",
                        padding: "6px 10px",
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
                        lineHeight: 1.75,
                        fontSize: ".9rem",
                        marginTop: "16px",
                      }}
                    >
                      {project.short_description ||
                        project.description ||
                        "Discover this project by Adigun Telecom."}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "7px",
                            marginTop: "18px",
                          }}
                        >
                          {project.technologies.map((technology) => (
                            <span
                              key={technology}
                              style={{
                                padding: "6px 9px",
                                background: "#eef4fb",
                                color: "#365575",
                                borderRadius: "5px",
                                fontSize: ".7rem",
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
                        paddingTop: "24px",
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
                          fontSize: ".85rem",
                        }}
                      >
                        View Details <ArrowRight size={17} />
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#64748b",
                            fontWeight: 700,
                            fontSize: ".82rem",
                          }}
                        >
                          Live Project <ExternalLink size={15} />
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

      {/* EXISTING CONTACT SECTION */}
      <section
        className="section"
        style={{
          background: "#F4F7FB",
          textAlign: "center",
        }}
      >
        <div className="container">
          <Sparkles size={35} color="
"#2879D8" />

          <h2
            style={{
              color: "#0A1830",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginTop: "18px",
            }}
          >
            Have an idea for a digital product?
          </h2>

          <p
            style={{
              color: "#64748b",
              maxWidth: "650px",
              margin: "18px auto 0",
              lineHeight: 1.8,
            }}
          >
            Let's discuss your idea and explore how technology
            can turn it into a practical solution.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{ marginTop: "28px", display: "inline-flex" }}
          >
            Talk to Our Team <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
