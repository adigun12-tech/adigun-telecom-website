
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Eye,
  ShieldCheck,
  Lightbulb,
  Award,
  Users,
} from "lucide-react";

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

export default function AboutPage() {
  return (
    <main>
      <section className="section" style={{ background: "#0A1830", color: "#fff" }}>
        <div className="container" style={{ paddingTop: "65px", paddingBottom: "65px" }}>
          <span className="section-label">ABOUT ADIGUN TELECOM</span>

          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", maxWidth: "800px", lineHeight: 1.15, marginTop: "20px" }}>
            Building Technology.
            <br />
            Empowering Progress.
          </h1>

          <p style={{ color: "#c4d0df", maxWidth: "680px", fontSize: "1.1rem", marginTop: "24px", lineHeight: 1.8 }}>
            We are an Africa-focused technology company committed to
            developing accessible digital solutions that help businesses,
            schools and organisations grow.
          </p>

          <Link href="/#contact" className="primary-button" style={{ marginTop: "30px", display: "inline-flex" }}>
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

          <p className="section-description" style={{ maxWidth: "850px" }}>
            Adigun Telecom is a technology company focused on creating
            practical digital solutions for a changing world. Our work
            centres on software development, website design, education
            technology and digital business solutions.
            <br /><br />
            We believe technology should do more than look impressive.
            It should solve real problems, simplify operations, improve
            access and create opportunities for individuals and
            organisations across Africa.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "#F4F7FB" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            <div style={{ background: "#fff", padding: "32px", borderRadius: "12px" }}>
              <Target size={34} color="#2879D8" />
              <h2 style={{ marginTop: "18px", color: "#0A1830", fontSize: "1.5rem" }}>
                Our Mission
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginTop: "12px" }}>
                To design, develop and deliver accessible, reliable and
                innovative technology solutions that simplify operations
                and create meaningful value.
              </p>
            </div>

            <div style={{ background: "#fff", padding: "32px", borderRadius: "12px" }}>
              <Eye size={34} color="#2879D8" />
              <h2 style={{ marginTop: "18px", color: "#0A1830", fontSize: "1.5rem" }}>
                Our Vision
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginTop: "12px" }}>
                To become a leading African technology company,
                recognised for delivering impactful digital solutions
                that empower progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">WHAT GUIDES US</span>

          <h2 className="section-title">Our Core Values</h2>

          <p className="section-description">
            The principles behind how we think, build and serve.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "22px", marginTop: "40px" }}>
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div key={value.title} style={{ padding: "26px", border: "1px solid #e5ebf3", borderRadius: "12px" }}>
                  <Icon size={30} color="#2879D8" />
                  <h3 style={{ color: "#0A1830", marginTop: "18px", fontSize: "1.15rem" }}>
                    {value.title}
                  </h3>
                  <p style={{ color: "#64748b", lineHeight: 1.7, marginTop: "10px" }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#0A1830", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">LET'S BUILD THE FUTURE</span>

          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginTop: "18px" }}>
            Progress begins with the right technology.
          </h2>

          <p style={{ color: "#c4d0df", marginTop: "18px" }}>
            Let's explore how Adigun Telecom can support your next idea.
          </p>

          <Link href="/#contact" className="primary-button" style={{ marginTop: "28px", display: "inline-flex" }}>
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
                }
