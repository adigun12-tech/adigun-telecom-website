
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  ArrowRight,
  Code2,
  GraduationCap,
  MonitorSmartphone,
  Palette,
  Lightbulb,
  ShieldCheck,
  Globe2,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Purpose-built digital platforms and software solutions designed around real business needs.",
  },
  {
    icon: MonitorSmartphone,
    title: "Website Development",
    description:
      "Modern, responsive websites that help businesses establish a strong digital presence.",
  },
  {
    icon: GraduationCap,
    title: "Education Technology",
    description:
      "Digital solutions that simplify school administration, academic management and communication.",
  },
  {
    icon: Palette,
    title: "Digital Design & Content",
    description:
      "Professional graphics and digital content that help brands communicate effectively.",
  },
  {
    icon: Lightbulb,
    title: "Business Digital Solutions",
    description:
      "Technology-driven solutions that improve business processes and everyday operations.",
  },
  {
    icon: Globe2,
    title: "Technology Consulting",
    description:
      "Practical technology guidance to help organisations identify opportunities and grow.",
  },
];

const values = [
  "Innovation",
  "Reliability",
  "Integrity",
  "Excellence",
  "Customer Focus",
  "Continuous Growth",
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <div className="container nav-container">
          <Link href="/" className="brand">
            <span className="brand-mark">A</span>
            <span>
              <strong>ADIGUN</strong>
              <small>TELECOM</small>
            </span>
          </Link>

<nav className="desktop-nav">
  <a href="#home">Home</a>
  <a href="about">About</a>
  <a href="services">Services</a>
  <a href="products">Products</a>
  <a href="portfolio">Portfolio</a>
  <a href="#contact">Contact</a>
</nav>
          <MobileMenu />

          <a href="#contact" className="nav-cta">
            Let's Talk <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-tag">
              <span className="status-dot" />
              AFRICAN TECHNOLOGY. GLOBAL POSSIBILITIES.
            </span>

            <h1>
              Building Technology.
              <span> Empowering Progress.</span>
            </h1>

            <p>
              We develop innovative digital solutions that help
              businesses, schools and organisations work smarter,
              grow stronger and embrace the future.
            </p>

            <div className="hero-actions">
              <a href="#services" className="primary-button">
                Explore Our Services <ArrowRight size={18} />
              </a>
              <a href="#about" className="secondary-button">
                Discover Adigun
              </a>
            </div>

            <div className="hero-note">
              <ShieldCheck size={17} />
              <span>Technology built around real-world needs.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-core">
              <span>A</span>
              <small>ADIGUN<br />TECHNOLOGY</small>
            </div>
            <div className="floating-card card-top">
              <Code2 size={20} />
              <span>Digital Innovation</span>
            </div>
            <div className="floating-card card-bottom">
              <Globe2 size={20} />
              <span>Built for Africa</span>
            </div>
          </div>
        </div>

        <div className="hero-bottom container">
          <span>INNOVATION</span>
          <span>TECHNOLOGY</span>
          <span>PROGRESS</span>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container about-grid">
          <div>
            <span className="section-label">WHO WE ARE</span>
            <h2 className="section-title">
              Technology with purpose.
              <br />
              Solutions with impact.
            </h2>
          </div>

          <div className="about-copy">
            <p>
              Adigun Telecom is an Africa-focused technology company
              committed to building useful, reliable and accessible
              digital solutions.
            </p>
            <p>
              Our focus is to combine creativity, technology and
              practical thinking to solve everyday challenges for
              businesses and organisations, starting in Nigeria.
            </p>
            <a href="#contact" className="text-link">
              Get to know us <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">WHAT WE DO</span>
              <h2 className="section-title">
                Technology solutions for a changing world.
              </h2>
            </div>
            <p className="section-description">
              We focus on practical digital services that help
              organisations improve, adapt and move forward.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article className="service-card" key={service.title}>
                  <div className="service-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#contact" aria-label={`Enquire about ${service.title}`}>
                    Explore service <ArrowRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      
<section className="section portfolio-section" id="portfolio">
  <div className="container">
    <div className="portfolio-heading">
      <div>
        <span className="section-label">SELECTED PROJECT</span>
        <h2 className="section-title">
          Technology put into practice.
        </h2>
      </div>
      <p className="section-description">
        Exploring practical digital solutions through real-world
        projects and continuous innovation.
      </p>
    </div>

    <article className="portfolio-card">
      <div className="portfolio-art">
        <div className="portfolio-screen">
          <div className="portfolio-screen-top">
            <span>TRUST FOUNDATION SCHOOL</span>
            <span>EDUCATION PLATFORM</span>
          </div>
          <div className="portfolio-screen-body">
            <GraduationCap size={48} />
            <strong>Digital School Management</strong>
            <span>Website • School Portal • Digital Administration</span>
          </div>
        </div>
      </div>

      <div className="portfolio-info">
        <span className="portfolio-category">EDUCATION TECHNOLOGY</span>
        <h3>Trust Foundation School</h3>
        <p>
          A digital education project bringing together a school
          website and school management portal to support
          administration, academic records and communication.
        </p>
        <span className="portfolio-status">
          Featured education technology project
        </span>
      </div>
    </article>
  </div>
</section>
      

      <section className="section product-section" id="products">
        <div className="container product-grid">
          <div className="product-visual">
            <div className="product-window">
              <div className="window-top">
                <span />
                <span />
                <span />
              </div>
              <div className="window-content">
                <div className="window-icon">
                  <GraduationCap size={34} />
                </div>
                <span className="window-caption">EDUCATION TECHNOLOGY</span>
                <h3>SchoolSuite</h3>
                <p>Smarter school management.</p>
                <div className="window-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>

          <div className="product-copy">
            <span className="section-label">OUR FLAGSHIP PRODUCT</span>
            <h2 className="section-title">
              Introducing Adigun SchoolSuite.
            </h2>
            <p>
              A school management platform being developed to
              simplify academic administration and connect schools,
              teachers, parents and students.
            </p>

            <ul className="product-features">
              <li><CheckCircle2 size={18} /> Student and staff management</li>
              <li><CheckCircle2 size={18} /> Attendance and academic records</li>
              <li><CheckCircle2 size={18} /> Results and report cards</li>
              <li><CheckCircle2 size={18} /> Parent and student portals</li>
            </ul>

            <span className="development-note">
              Product development in progress
            </span>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <div className="values-heading">
            <span className="section-label">WHAT GUIDES US</span>
            <h2 className="section-title">
              Built on principles that matter.
            </h2>
            <p className="section-description">
              Our commitment to quality, trust and meaningful
              innovation shapes every solution we pursue.
            </p>
          </div>

          <div className="values-grid">
            {values.map((value) => (
              <div className="value-item" key={value}>
                <CheckCircle2 size={19} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="contact-section" id="contact">
  <div className="container contact-content">
    <span className="section-label">LET'S BUILD SOMETHING</span>

    <h2>
      Have a challenge?
      <br />
      Let's create a solution.
    </h2>

    <p>
      Connect with Adigun Telecom to discuss your technology
      needs and explore possibilities.
    </p>

    <div className="contact-actions">
      <a href="tel:+2347042723692" className="primary-button">
        Call 07042723692 <ArrowRight size={18} />
      </a>

      <a href="tel:+234907840739" className="contact-number">
        09078440739
      </a>

      <a
        href="mailto:adiguntelecoms@gmail.com"
        className="contact-number"
      >
        Email Us
      </a>
    </div>
  </div>
</section>

<footer className="footer">
  <div className="container footer-main">
    <Link href="/" className="brand footer-brand">
      <span className="brand-mark">A</span>
      <span>
        <strong>ADIGUN</strong>
        <small>TELECOM</small>
      </span>
    </Link>

    <p>Building Technology. Empowering Progress.</p>

    <div className="footer-links">
      <a href="#home">Home</a>
      <a href="about">About</a>
      <a href="services">Services</a>
      <a href="products">Products</a>
      <a href="portfolio">Portfolio</a>
      <a href="#contact">Contact</a>
    </div>
  </div>

  <div className="container footer-bottom">
    <span>© {new Date().getFullYear()} Adigun Telecom.</span>
    <span>Building a smarter digital future.</span>
  </div>
</footer>
<WhatsAppButton />
    </main>
  );
              }
