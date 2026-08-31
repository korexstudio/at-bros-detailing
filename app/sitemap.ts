import type { MetadataRoute } from "next";
import { sellableServices } from "@/content";
import { SITE_URL } from "@/content/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/services", "/gallery", "/about", "/contact"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const servicePages = sellableServices.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...servicePages];
}
