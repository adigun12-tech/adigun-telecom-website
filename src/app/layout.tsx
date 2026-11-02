
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adigun Telecom | Building Technology. Empowering Progress.",
    template: "%s | Adigun Telecom",
  },
  description:
    "Adigun Telecom is an Africa-focused technology company providing software development, website design, education technology and digital business solutions.",
  applicationName: "Adigun Telecom",
  keywords: [
    "Adigun Telecom",
    "Technology Company in Nigeria",
    "Software Development",
    "Website Design",
    "Education Technology",
    "Digital Solutions",
  ],
  openGraph: {
    title: "Adigun Telecom | Building Technology. Empowering Progress.",
    description:
      "Building innovative digital solutions and empowering businesses across Africa.",
    siteName: "Adigun Telecom",
    type: "website",
  },
};
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
