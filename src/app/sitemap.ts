
import type { MetadataRoute } from "next";

const BASE_URL = "https://adiguntelecom.com.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/services",
    "/products",
    "/portfolio",
    "/contact",
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority:
      page === ""
        ? 1
        : page === "/contact" || page === "/services"
          ? 0.8
          : 0.7,
  }));
}
