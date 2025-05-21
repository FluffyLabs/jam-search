import { sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import FirecrawlApp from "firecrawl";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface Sitemap {
  urlset: {
    url: SitemapUrl[];
  };
}

interface PageUrl {
  url: string;
  lastModified?: Date;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSitemap(sitemapUrl: string): Promise<PageUrl[]> {
  const response = await fetch(sitemapUrl);
  const xml = await response.text();
  const parser = new XMLParser();
  const result = parser.parse(xml) as Sitemap;

  return result.urlset.url.map((item) => ({
    url: item.loc,
    lastModified: item.lastmod ? new Date(item.lastmod) : undefined,
  }));
}

async function fetchPageContent(
  url: string
): Promise<{ content: string; title: string }> {
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const result = await firecrawl.scrapeUrl(url, {
    formats: ["markdown"],
  });

  if (!result.success) {
    throw new Error(`Failed to scrape ${url}: ${result.error}`);
  }

  return {
    content: result.markdown || "",
    title: result.metadata?.title || "",
  };
}

function cleanContent(content: string): string | null {
  // Remove both patterns:
  // 1. "[Skip to main content](url) On this page"
  // 2. "[Skip to main content](url)"
  const cleanedContent = content
    .replace(/\[Skip to main content\]\([^)]+\)\s*On this page/g, "")
    .replace(/\[Skip to main content\]\([^)]+\)/g, "")
    .trim();

  // If content is empty or only contains whitespace after cleaning, return null
  if (!cleanedContent) {
    return null;
  }

  return cleanedContent;
}

function removeSiteFromUrl(url: string, site: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search + urlObj.hash;
    return path.startsWith("/") ? path : "/" + path;
  } catch (error) {
    console.error(`Error removing site from URL ${url}:`, error);
    return url;
  }
}

export async function fetchAndStorePages(
  input: string | string[] | { sitemapUrl: string },
  site: string
) {
  let pageUrls: PageUrl[] = [];

  try {
    // Handle different input types
    if (typeof input === "string") {
      // Single URL
      pageUrls = [{ url: input }];
    } else if (Array.isArray(input)) {
      // Array of URLs
      pageUrls = input.map((url) => ({ url }));
    } else if (input.sitemapUrl) {
      // Sitemap URL
      console.log("Fetching sitemap...");
      pageUrls = await fetchSitemap(input.sitemapUrl);
    } else {
      throw new Error(
        "Invalid input format. Expected string, string[], or { sitemapUrl: string }"
      );
    }

    console.log(`Found ${pageUrls.length} pages to process`);

    await db.transaction(async (tx) => {
      // Clear existing pages
      // await tx.delete(pagesTable);
      // console.log("Cleared existing pages");

      // Fetch and store each page
      for (const pageUrl of pageUrls) {
        try {
          console.log(`Fetching ${pageUrl.url}...`);
          const pageContent = await fetchPageContent(pageUrl.url);

          const cleanedContent = cleanContent(pageContent.content);

          // Skip if content is empty after cleaning
          if (!cleanedContent) {
            console.log(`Skipping ${pageUrl.url} - no valid content`);
            continue;
          }

          const urlWithoutSite = removeSiteFromUrl(pageUrl.url, site);

          await tx
            .insert(pagesTable)
            .values({
              url: urlWithoutSite,
              content: cleanedContent,
              title: pageContent.title,
              site,
              lastModified: pageUrl.lastModified || new Date(),
            })
            .onConflictDoUpdate({
              target: pagesTable.url,
              set: {
                content: cleanedContent,
                title: pageContent.title,
                site,
                lastModified: pageUrl.lastModified || new Date(),
              },
            });

          console.log(`Stored ${urlWithoutSite}`);

          // Add delay between requests to avoid rate limiting
          await delay(4000); // 4 second delay
        } catch (error) {
          console.error(`Error processing ${pageUrl.url}:`, error);
          // Add delay even after errors to maintain rate limiting
          throw error;
        }
      }

      console.log("Reindexing pages_search_idx");
      await tx.execute(sql`REINDEX INDEX pages_search_idx;`);
    });

    console.log("Done! Closing connection...");
    await db.$client.end();
  } catch (error) {
    console.error("Error fetching and storing pages:", error);
    process.exit(1);
  }
}
