
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server-admin";
import "./globals.css";

const SITE_URL = "https://adiguntelecom.com.ng";

const defaultTitle =
  "Adigun Telecom | Building Technology. Empowering Progress.";

const defaultDescription =
  "Adigun Telecom is an Africa-focused technology company providing software development, website design, education technology and digital business solutions.";

export async function generateMetadata(): Promise<Metadata> {
  let title = defaultTitle;
  let description = defaultDescription;

  try {
    const { data, error } = await supabaseAdmin
      .from("website_settings")
      .select("settings")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("SEO metadata settings error:", error);
    } else if (data?.settings) {
      const settings = data.settings as {
        websiteTitle?: string;
        metaDescription?: string;
      };

      if (settings.websiteTitle?.trim()) {
        title = settings.websiteTitle.trim();
      }

      if (settings.metaDescription?.trim()) {
        description = settings.metaDescription.trim();
      }
    }
  } catch (error) {
    console.error("Unable to load SEO metadata:", error);
  }

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
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
