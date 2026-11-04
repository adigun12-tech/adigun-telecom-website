
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import "./globals.css";

const SITE_URL = "https://adiguntelecom.com.ng";

const defaultTitle =
  "Adigun Telecom | Building Technology. Empowering Progress.";

const defaultDescription =
  "Adigun Telecom is an Africa-focused technology company providing software development, website design, education technology and digital business solutions.";

type WebsiteSettings = {
  companyName?: string;
  slogan?: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  websiteTitle?: string;
  metaDescription?: string;
  logoUrl?: string;
};

async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from("website_settings")
      .select("settings")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Website settings error:", error);
      return {};
    }

    return (data?.settings || {}) as WebsiteSettings;
  } catch (error) {
    console.error("Unable to load website settings:", error);
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();

  const title = settings.websiteTitle?.trim() || defaultTitle;
  const description =
    settings.metaDescription?.trim() || defaultDescription;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: title,
      template: "%s | Adigun Telecom",
    },

    description,

    applicationName: "Adigun Telecom",

    keywords: [
      "Adigun Telecom",
      "Technology Company in Nigeria",
      "Software Development",
      "Website Design",
      "Education Technology",
      "Digital Solutions",
    ],

    alternates: {
      canonical: "/",
    },

    openGraph: {
      title,
      description,
      siteName: "Adigun Telecom",
      url: SITE_URL,
      type: "website",
      locale: "en_NG",
      ...(settings.logoUrl?.trim()
        ? {
            images: [
              {
                url: settings.logoUrl.trim(),
                alt: "Adigun Telecom Logo",
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(settings.logoUrl?.trim()
        ? { images: [settings.logoUrl.trim()] }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getWebsiteSettings();

  const socialProfiles = [
    settings.facebook,
    settings.instagram,
    settings.linkedin,
    settings.x,
  ].filter(
    (url): url is string =>
      typeof url === "string" && /^https?:\/\//i.test(url.trim())
  ).map((url) => url.trim());

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: settings.companyName?.trim() || "Adigun Telecom",
        url: SITE_URL,
        description:
          settings.metaDescription?.trim() || defaultDescription,
        ...(settings.slogan?.trim()
          ? { slogan: settings.slogan.trim() }
          : {}),
        ...(settings.logoUrl?.trim()
          ? {
              logo: {
                "@type": "ImageObject",
                url: settings.logoUrl.trim(),
              },
            }
          : {}),
        ...(settings.email?.trim()
          ? { email: settings.email.trim() }
          : {}),
        ...(settings.phone1?.trim()
          ? { telephone: settings.phone1.trim() }
          : {}),
        ...(settings.address?.trim()
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address.trim(),
                addressCountry: "NG",
              },
            }
          : {}),
        ...(socialProfiles.length > 0
          ? { sameAs: socialProfiles }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.companyName?.trim() || "Adigun Telecom",
        description:
          settings.metaDescription?.trim() || defaultDescription,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-NG",
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        {children}
      </body>
    </html>
  );
}
