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
    onlyMainContent: true,
  });

  if (!result.success) {
    throw new Error(`Failed to scrape ${url}: ${result.error}`);
  }

  return {
    content: result.markdown || "",
    title: result.title || "",
  };
}

export async function fetchAndStorePages(
  input: string | string[] | { sitemapUrl: string }
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

          await tx
            .insert(pagesTable)
            .values({
              url: pageUrl.url,
              content: pageContent.content,
              title: pageContent.title,
              lastModified: pageUrl.lastModified || new Date(),
            })
            .onConflictDoUpdate({
              target: pagesTable.url,
              set: {
                content: pageContent.content,
                title: pageContent.title,
                lastModified: pageUrl.lastModified || new Date(),
              },
            });

          console.log(`Stored ${pageUrl.url}`);
        } catch (error) {
          console.error(`Error processing ${pageUrl.url}:`, error);
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
