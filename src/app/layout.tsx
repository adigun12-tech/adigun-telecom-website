
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adigun Telecom | Building Technology. Empowering Progress.",
  description:
    "Adigun Telecom is an Africa-focused technology company delivering digital solutions, software development, education technology and business innovation.",
  applicationName: "Adigun Telecom",
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
