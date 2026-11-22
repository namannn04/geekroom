import type { Metadata } from "next";

/**
 * Page metadata with matching link-preview text. Next.js doesn't derive Open Graph or X titles
 * from a page's own title, so without this every shared link showed the home page's copy.
 * The preview image itself comes from the route's opengraph-image file.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | Geek Room`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Geek Room", title: full, description, url: path },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
