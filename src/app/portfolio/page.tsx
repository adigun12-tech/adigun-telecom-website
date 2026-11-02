
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Building2,
  Code2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

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
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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

      <section
        className="section"
        style={{
          background: "#F4F7FB",
          textAlign: "center",
        }}
      >
        <div className="container">
          <Sparkles size={35} color="#2879D8" />

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
