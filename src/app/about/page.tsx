import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import {
  ArrowRight,
  Target,
  Eye,
  ShieldCheck,
  Lightbulb,
  Award,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Adigun Telecom",
  description:
    "Learn about Adigun Telecom, our mission, values and commitment to building innovative technology solutions that empower businesses and organisations.",
};

export const dynamic = "force-dynamic";

type LogoSettings = {
  logoUrl?: string;
  logoLightUrl?: string;
};

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace creative thinking and modern technology to develop meaningful solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "We are committed to dependable solutions, quality delivery and lasting value.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We pursue high standards in every solution, service and customer experience.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "We put people and their needs at the centre of our technology solutions.",
  },
];

export default async function AboutPage() {
  let logoUrl = "";
  let logoLightUrl = "";

  try {
    const { data, error } = await supabaseAdmin
      .from("website_settings")
      .select("settings")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("About page logo settings error:", error);
    } else if (data?.settings) {
      const settings = data.settings as LogoSettings;

      logoUrl =
        typeof settings.logoUrl === "string"
          ? settings.logoUrl
          : "";

      logoLightUrl =
        typeof settings.logoLightUrl === "string"
          ? settings.logoLightUrl
          : "";
    }
  } catch (error) {
    console.error("Unable to load About page logos:", error);
  }

  return (
    <main>
      <header className="site-header">
        <div className="container nav-container">
          <Link
            href="/"
            className="brand"
            aria-label="Adigun Telecom Home"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
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

          <div className="mobile-menu-placeholder">
            <Link href="/contact" className="nav-cta">
              Let's Talk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section
        className="section"
        style={{ background: "#0A1830", color: "#fff" }}
      >
        <div
          className="container"
          style={{
            paddingTop: "65px",
            paddingBottom: "65px",
          }}
        >
          <span className="section-label">
            ABOUT ADIGUN TELECOM
          </span>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              maxWidth: "800px",
              lineHeight: 1.15,
              marginTop: "20px",
            }}
          >
            Building Technology.
            <br />
            Empowering Progress.
          </h1>

          <p
            style={{
              color: "#c4d0df",
              maxWidth: "680px",
              fontSize: "1.1rem",
              marginTop: "24px",
              lineHeight: 1.8,
            }}
          >
            We are an Africa-focused technology company
            committed to developing accessible digital
            solutions that help businesses, schools and
            organisations grow.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{
              marginTop: "30px",
              display: "inline-flex",
            }}
          >
            Work With Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">WHO WE ARE</span>

          <h2 className="section-title">
            Technology with purpose.
          </h2>

          <p
            className="section-description"
            style={{ maxWidth: "850px" }}
          >
            Adigun Telecom is a technology company focused
            on creating practical digital solutions for a
            changing world. Our work centres on software
            development, website design, education
            technology and digital business solutions.
            <br />
            <br />
            We believe technology should do more than look
            impressive. It should solve real problems,
            simplify operations, improve access and create
            opportunities for individuals and organisations
            across Africa.
          </p>
        </div>
      </section>

      <section
        className="section"
        style={{ background: "#F4F7FB" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "32px",
                borderRadius: "12px",
              }}
            >
              <Target size={34} color="#2879D8" />

              <h2
                style={{
                  marginTop: "18px",
                  color: "#0A1830",
                  fontSize: "1.5rem",
                }}
              >
                Our Mission
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.8,
                  marginTop: "12px",
                }}
              >
                To design, develop and deliver accessible,
                reliable and innovative technology solutions
                that simplify operations and create
                meaningful value.
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "32px",
                borderRadius: "12px",
              }}
            >
              <Eye size={34} color="#2879D8" />

              <h2
                style={{
                  marginTop: "18px",
                  color: "#0A1830",
                  fontSize: "1.5rem",
                }}
              >
                Our Vision
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.8,
                  marginTop: "12px",
                }}
              >
                To become a leading African technology
                company, recognised for delivering impactful
                digital solutions that empower progress.
              </p>
            </div>
          </div>
        </div>
      </section>
            <section className="section">
        <div className="container">
          <span className="section-label">
            WHAT GUIDES US
          </span>

          <h2 className="section-title">
            Our Core Values
          </h2>

          <p className="section-description">
            The principles behind how we think, build and serve.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "22px",
              marginTop: "40px",
            }}
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  style={{
                    padding: "26px",
                    border: "1px solid #e5ebf3",
                    borderRadius: "12px",
                  }}
                >
                  <Icon size={30} color="#2879D8" />

                  <h3
                    style={{
                      color: "#0A1830",
                      marginTop: "18px",
                      fontSize: "1.15rem",
                    }}
                  >
                    {value.title}
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: 1.7,
                      marginTop: "10px",
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: "#0A1830",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <span className="section-label">
            LET'S BUILD THE FUTURE
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginTop: "18px",
            }}
          >
            Progress begins with the right technology.
          </h2>

          <p
            style={{
              color: "#c4d0df",
              marginTop: "18px",
            }}
          >
            Let's explore how Adigun Telecom can support
            your next idea.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{
              marginTop: "28px",
              display: "inline-flex",
            }}
          >
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-main">
          <Link
            href="/"
            className="brand footer-brand"
            aria-label="Adigun Telecom Home"
          >
            {logoLightUrl ? (
              <img
                src={logoLightUrl}
                alt="Adigun Telecom"
                className="h-12 w-auto max-w-[190px] object-contain"
              />
            ) : logoUrl ? (
              <img
                src={logoUrl}
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
