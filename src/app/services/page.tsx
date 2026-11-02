
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Globe2,
  GraduationCap,
  MonitorSmartphone,
  Palette,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    number: "01",
    title: "Custom Software Development",
    description:
      "Purpose-built software solutions designed around the unique needs and workflows of businesses and organisations.",
    features: [
      "Business management systems",
      "Custom web applications",
      "Workflow automation",
      "Database-driven platforms",
    ],
  },
  {
    icon: Globe2,
    number: "02",
    title: "Website Design & Development",
    description:
      "Professional, responsive websites that establish credibility, communicate your brand and support business growth.",
    features: [
      "Business websites",
      "School websites",
      "Landing pages",
      "Website maintenance",
    ],
  },
  {
    icon: GraduationCap,
    number: "03",
    title: "Education Technology",
    description:
      "Digital tools designed to help educational institutions improve administration, communication and learning management.",
    features: [
      "School management platforms",
      "Student and parent portals",
      "Academic record management",
      "Digital school solutions",
    ],
  },
  {
    icon: MonitorSmartphone,
    number: "04",
    title: "Business Digital Solutions",
    description:
      "Practical technology solutions that help businesses improve their operations and serve customers more effectively.",
    features: [
      "Digital business platforms",
      "Online service solutions",
      "Business process improvement",
      "Digital transformation support",
    ],
  },
  {
    icon: Palette,
    number: "05",
    title: "Graphics & Digital Content",
    description:
      "Creative visual communication that helps businesses present their identity and connect with their audiences.",
    features: [
      "Brand identity design",
      "Promotional graphics",
      "Digital advertisements",
      "Animation and video content",
    ],
  },
  {
    icon: Lightbulb,
    number: "06",
    title: "IT & Technology Consulting",
    description:
      "Technology guidance to help organisations identify suitable digital tools and make informed technology decisions.",
    features: [
      "Technology planning",
      "Digital solution recommendations",
      "IT project guidance",
      "Technical support consulting",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section
        className="section"
        style={{ background: "#0A1830", color: "#fff" }}
      >
        <div
          className="container"
          style={{ paddingTop: "65px", paddingBottom: "65px" }}
        >
          <span className="section-label">WHAT WE DO</span>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              maxWidth: "800px",
              lineHeight: 1.15,
              marginTop: "20px",
            }}
          >
            Technology Solutions
            <br />
            Built Around Your Needs.
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
            From software development to digital business solutions,
            we help organisations explore technology that solves
            problems and creates opportunities.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{ marginTop: "30px", display: "inline-flex" }}
          >
            Discuss a Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">OUR EXPERTISE</span>

          <h2 className="section-title">
            Solutions That Move You Forward.
          </h2>

          <p className="section-description">
            Explore our technology and creative service areas.
            Each solution is approached with attention to quality,
            usability and practical results.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              marginTop: "45px",
            }}
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  style={{
                    padding: "30px",
                    border: "1px solid #e5ebf3",
                    borderRadius: "12px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Icon size={34} color="#2879D8" />
                    <span
                      style={{
                        color: "#aab6c5",
                        fontWeight: 800,
                        fontSize: "1rem",
                      }}
                    >
                      {service.number}
                    </span>
                  </div>

                  <h2
                    style={{
                      color: "#0A1830",
                      fontSize: "1.25rem",
                      marginTop: "22px",
                    }}
                  >
                    {service.title}
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: 1.8,
                      marginTop: "12px",
                      fontSize: ".93rem",
                    }}
                  >
                    {service.description}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      marginTop: "22px",
                    }}
                  >
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "9px",
                          color: "#334155",
                          fontSize: ".87rem",
                        }}
                      >
                        <CheckCircle2
                          size={17}
                          color="#2879D8"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        {feature}
                      </div>
                    ))}
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
          background: "#0A1830",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <span className="section-label">HAVE A PROJECT IN MIND?</span>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginTop: "18px",
            }}
          >
            Let's turn your idea into a solution.
          </h2>

          <p style={{ color: "#c4d0df", marginTop: "18px" }}>
            Tell us what you want to achieve. Let's explore
            the possibilities together.
          </p>

          <Link
            href="/#contact"
            className="primary-button"
            style={{ marginTop: "28px", display: "inline-flex" }}
          >
            Contact Adigun Telecom <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
            }
