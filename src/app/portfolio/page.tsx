import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Our Portfolio | Adigun Telecom",
  description:
    "Explore Adigun Telecom's portfolio of websites, software applications, education technology platforms and digital projects built for businesses and organisations.",
  openGraph: {
    title: "Our Portfolio | Adigun Telecom",
    description:
      "Discover digital projects and technology solutions developed by Adigun Telecom.",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
