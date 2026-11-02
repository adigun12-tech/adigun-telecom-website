
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
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

type Service = {
  title: string;
  description: string;
};

type WebsiteContent = {
  hero: {
    tag: string;
    heading: string;
    highlight: string;
    description: string;
  };
  about: {
    label: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
  };
  services: {
    label: string;
    heading: string;
    description: string;
    items: Service[];
  };
  values: {
    label: string;
    heading: string;
    description: string;
    items: string[];
  };
  contact: {
    label: string;
    heading: string;
    description: string;
    phone1: string;
    phone2: string;
    email: string;
  };
};

const defaultContent: WebsiteContent = {
  hero: {
    tag: "AFRICAN TECHNOLOGY. GLOBAL POSSIBILITIES.",
    heading: "Building Technology.",
    highlight: "Empowering Progress.",
    description:
      "We develop innovative digital solutions that help businesses, schools and organisations work smarter, grow stronger and embrace the future.",
  },
  about: {
    label: "WHO WE ARE",
    heading: "Technology with purpose. Solutions with impact.",
    paragraph1:
      "Adigun Telecom is an Africa-focused technology company committed to building useful, reliable and accessible digital solutions.",
    paragraph2:
      "Our focus is to combine creativity, technology and practical thinking to solve everyday challenges for businesses and organisations, starting in Nigeria.",
  },
  services: {
    label: "WHAT WE DO",
    heading: "Technology solutions for a changing world.",
    description:
      "We focus on practical digital services that help organisations improve, adapt and move forward.",
    items: [
      {
        title: "Software Development",
        description:
          "Purpose-built digital platforms and software solutions designed around real business needs.",
      },
      {
        title: "Website Development",
        description:
          "Modern, responsive websites that help businesses establish a strong digital presence.",
      },
      {
        title: "Education Technology",
        description:
          "Digital solutions that simplify school administration, academic management and communication.",
      },
      {
        title: "Digital Design & Content",
        description:
          "Professional graphics and digital content that help brands communicate effectively.",
      },
      {
        title: "Business Digital Solutions",
        description:
          "Technology-driven solutions that improve business processes and everyday operations.",
      },
      {
        title: "Technology Consulting",
        description:
          "Practical technology guidance to help organisations identify opportunities and grow.",
      },
    ],
  },
  values: {
    label: "WHAT GUIDES US",
    heading: "Built on principles that matter.",
    description:
      "Our commitment to quality, trust and meaningful innovation shapes every solution we pursue.",
    items: [
      "Innovation",
      "Reliability",
      "Integrity",
      "Excellence",
      "Customer Focus",
      "Continuous Growth",
    ],
  },
  contact: {
    label: "LET'S BUILD SOMETHING",
    heading: "Have a challenge? Let's create a solution.",
    description:
      "Connect with Adigun Telecom to discuss your technology needs and explore possibilities.",
    phone1: "07042723692",
    phone2: "09078440739",
    email: "adiguntelecoms@gmail.com",
  },
};

function mergeContent(saved: any): WebsiteContent {
  return {
    hero: {
      ...defaultContent.hero,
      ...saved?.hero,
    },
    about: {
      ...defaultContent.about,
      ...saved?.about,
    },
    services: {
      ...defaultContent.services,
      ...saved?.services,
      items: Array.isArray(saved?.services?.items)
        ? saved.services.items
        : defaultContent.services.items,
    },
    values: {
      ...defaultContent.values,
      ...saved?.values,
      items: Array.isArray(saved?.values?.items)
        ? saved.values.items
        : defaultContent.values.items,
    },
    contact: {
      ...defaultContent.contact,
      ...saved?.contact,
    },
  };
}

function phoneLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const serviceIcons = [
  Code2,
  MonitorSmartphone,
  GraduationCap,
  Palette,
  Lightbulb,
  Globe2,
];

export default async function HomePage() {
  let content = defaultContent;

  try {
    const { data, error } = await supabaseAdmin
      .from("website_content")
      .select("content")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Homepage content error:", error);
    } else if (data?.content) {
      content = mergeContent(data.content);
    }
  } catch (error) {
    console.error("Unable to load homepage content:", error);
  }

  const services = content.services.items;
  const values = content.values.items;
  const phone1Link = phoneLink(content.contact.phone1);
  const phone2Link = phoneLink(content.contact.phone2);

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
            <Link href="/#home">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/products">Products</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/#contact">Contact</Link>
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
              {content.hero.tag}
            </span>

            <h1>
              {content.hero.heading}
              <span> {content.hero.highlight}</span>
            </h1>

            <p>{content.hero.description}</p>

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
              <small>
                ADIGUN
                <br />
                TECHNOLOGY
              </small>
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
            <span className="section-label">
              {content.about.label}
            </span>

            <h2 className="section-title">
              {content.about.heading}
            </h2>
          </div>

          <div className="about-copy">
            <p>{content.about.paragraph1}</p>
            <p>{content.about.paragraph2}</p>

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
              <span className="section-label">
                {content.services.label}
              </span>

              <h2 className="section-title">
                {content.services.heading}
              </h2>
            </div>

            <p className="section-description">
              {content.services.description}
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon =
                serviceIcons[index % serviceIcons.length];

              return (
                <article
                  className="service-card"
                  key={`${service.title}-${index}`}
                >
                  <div className="service-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <a
                    href="#contact"
                    aria-label={`Enquire about ${service.title}`}
                  >
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
              <span className="section-label">
                SELECTED PROJECT
              </span>

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
                  <span>
                    Website • School Portal • Digital Administration
                  </span>
                </div>
              </div>
            </div>

            <div className="portfolio-info">
              <span className="portfolio-category">
                EDUCATION TECHNOLOGY
              </span>

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

                <span className="window-caption">
                  EDUCATION TECHNOLOGY
                </span>

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
            <span className="section-label">
              OUR FLAGSHIP PRODUCT
            </span>

            <h2 className="section-title">
              Introducing Adigun SchoolSuite.
            </h2>

            <p>
              A school management platform being developed to
              simplify academic administration and connect schools,
              teachers, parents and students.
            </p>

            <ul className="product-features">
              <li>
                <CheckCircle2 size={18} />
                Student and staff management
              </li>
              <li>
                <CheckCircle2 size={18} />
                Attendance and academic records
              </li>
              <li>
                <CheckCircle2 size={18} />
                Results and report cards
              </li>
              <li>
                <CheckCircle2 size={18} />
                Parent and student portals
              </li>
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
            <span className="section-label">
              {content.values.label}
            </span>

            <h2 className="section-title">
              {content.values.heading}
            </h2>

            <p className="section-description">
              {content.values.description}
            </p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div className="value-item" key={`${value}-${index}`}>
                <CheckCircle2 size={19} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-content">
          <span className="section-label">
            {content.contact.label}
          </span>

          <h2>
            {content.contact.heading}
          </h2>

          <p>{content.contact.description}</p>

          <div className="contact-actions">
            <a href={phone1Link} className="primary-button">
              Call {content.contact.phone1}
              <ArrowRight size={18} />
            </a>

            <a
              href={phone2Link}
              className="contact-number"
            >
              {content.contact.phone2}
            </a>

            <a
              href={`mailto:${content.contact.email}`}
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
            <Link href="/#home">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/#services">Services</Link>
            <Link href="/products">Products</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/#contact">Contact</Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Adigun Telecom.
          </span>

          <span>Building a smarter digital future.</span>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  );
}

