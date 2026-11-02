
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Globe,
  Headphones,
} from "lucide-react";

export default function ContactPage() {
  const phoneNumbers = [
    { number: "07042723692", link: "+2347042723692" },
    { number: "09078440739", link: "+2349078440739" },
  ];

  const email = "adiguntelecoms@gmail.com";

  const whatsappMessage = encodeURIComponent(
    "Hello Adigun Telecom, I would like to make an enquiry about your technology services."
  );

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#0A1830]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0A1830] px-6 py-24 text-white md:py-32">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <span className="mb-6 inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
            Contact Adigun Telecom
          </span>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Let's Build Something
            <span className="block text-blue-400">Great Together.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Have a project, business idea or technology challenge?
            We would love to hear from you. Let's discuss how Adigun
            Telecom can help bring your ideas to life.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/2347042723692?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-500"
            >
              <MessageCircle size={19} />
              Chat on WhatsApp
            </a>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-3 rounded-lg border border-white/20 px-7 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Send an Email
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Get in Touch
            </span>

            <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
              We Are Ready to Hear From You
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Reach out through any of our official contact channels.
              Our team will be glad to discuss your enquiry.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* PHONE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Phone size={26} />
              </div>

              <h3 className="text-xl font-bold">Call Us</h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Speak with us directly about your project or enquiry.
              </p>

              <div className="mt-6 space-y-3">
                {phoneNumbers.map((phone) => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.link}`}
                    className="block font-bold text-blue-700 hover:underline"
                  >
                    {phone.number}
                  </a>
                ))}
              </div>
            </div>

            {/* EMAIL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail size={26} />
              </div>

              <h3 className="text-xl font-bold">Email Us</h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Send us your questions, proposals and business enquiries.
              </p>

              <a
                href={`mailto:${email}`}
                className="mt-6 inline-block break-all font-bold text-blue-700 hover:underline"
              >
                {email}
              </a>
            </div>

            {/* WHATSAPP */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MessageCircle size={26} />
              </div>

              <h3 className="text-xl font-bold">WhatsApp</h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Connect with us quickly through WhatsApp.
              </p>

              <a
                href={`https://wa.me/2347042723692?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block font-bold text-green-600 hover:underline"
              >
                Start a Conversation →
              </a>
            </div>

            {/* LOCATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={26} />
              </div>

              <h3 className="text-xl font-bold">Our Reach</h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Based in Nigeria, with a vision to serve businesses
                and organisations across Africa.
              </p>
            </div>

            {/* AVAILABILITY */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock size={26} />
              </div>

              <h3 className="text-xl font-bold">Enquiries</h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                You can send enquiries by email or WhatsApp at any time.
                We will respond as soon as possible.
              </p>
            </div>

            {/* SUPPORT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Headphones size={26} />
              </div>

              <h3 className="text-xl font-bold">Business Support</h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Discuss technology services, digital projects,
                collaborations and business opportunities with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#0A1830] px-7 py-14 text-center text-white md:px-16 md:py-20">
          <Globe className="mx-auto mb-6 text-blue-400" size={38} />

          <h2 className="text-3xl font-extrabold md:text-4xl">
            Building Technology.
            <span className="block text-blue-400">
              Empowering Progress.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Let's work together to create meaningful digital solutions
            that move businesses and communities forward.
          </p>

          <a
            href={`mailto:${email}`}
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-500"
          >
            Start a Conversation
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div>
            <p className="text-lg font-extrabold text-[#0A1830]">
              ADIGUN <span className="text-blue-600">TELECOM</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Building Technology. Empowering Progress.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <Link href="/portfolio" className="hover:text-blue-600">Portfolio</Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Adigun Telecom.
          </p>
        </div>
      </footer>
    </main>
  );
      }
