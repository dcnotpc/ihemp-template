/**
 * Sitemap — Phase 1.5.2
 *
 * Only published posts are included in the sitemap, in all environments.
 * This is intentional: even on a preview deployment, we never want draft
 * URLs surfaced to search engines via the sitemap.
 */

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { stateConfig } from "@/config/state";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${stateConfig.domain}`;

  // Always production-only — never include unpublished posts in the sitemap
  const publishedPosts = getAllPosts({
    stateSlug: stateConfig.slug,
    includeUnpublished: false,
  });

  const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
}
