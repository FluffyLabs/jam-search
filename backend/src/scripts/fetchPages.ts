import { setTimeout } from "node:timers/promises";
import { XMLParser } from "fast-xml-parser";
import type Firecrawl from "firecrawl";
import { SdkError } from "firecrawl";
import fetch from "node-fetch";
import { type PageData, writeDocsPage } from "../data/writer.js";

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
  return setTimeout(ms);
}

async function fetchSitemap(sitemapUrl: string): Promise<PageUrl[]> {
  const response = await fetch(sitemapUrl);
  const xml = await response.text();
  const parser = new XMLParser();
  const result = parser.parse(xml) as Sitemap;

  return result.urlset.url.map((item) => ({
    url: item.loc.replace(
      "https://jam-docs.onrender.com",
      "https://docs.jamcha.in"
    ),
    lastModified: item.lastmod ? new Date(item.lastmod) : undefined,
  }));
}

async function fetchPageContent(
  firecrawl: Firecrawl,
  url: string
): Promise<{ content: string; title: string }> {
  const result = await firecrawl.scrape(url, {
    formats: ["markdown"],
  });

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

export async function fetchAndStorePages(
  firecrawl: Firecrawl,
  input: string | string[] | { sitemapUrl: string },
  site: string,
  dataDir: string
) {
  let pageUrls: PageUrl[] = [];

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

  let temporaryErrors = 0;
  let delayMultiplier = 10;
  const errors: [string, SdkError][] = [];

  // Fetch and store each page
  for (;;) {
    const pageUrl = pageUrls.pop();
    // all pages processed, finish up.
    if (pageUrl === undefined) {
      break;
    }

    // Add delay between requests to avoid rate limiting
    await delay(Math.max(1000, delayMultiplier * delayMultiplier * 5));

    console.log(`Fetching ${pageUrl.url}`);
    let pageContent = { content: "", title: "" };
    try {
      pageContent = await fetchPageContent(firecrawl, pageUrl.url);
    } catch (e) {
      // non-firecrawl errors should be propagated immediately
      if (!(e instanceof SdkError)) {
        throw e;
      }

      // detect rate limiting and try again
      if (e.status === 429) {
        console.log(`Reached rate-limitting, will retry ${pageUrl.url}`);
        delayMultiplier += 10;
        pageUrls.push(pageUrl);
        continue;
      }

      // detect timeout and gateway errors and try again
      const isTemporaryError = e.status === 408 || e.status === 502;
      if (isTemporaryError && temporaryErrors < 5) {
        console.log(`${e.status} when fetching, will retry ${pageUrl.url}`);
        pageUrls.push(pageUrl);
        temporaryErrors += 1;
        delayMultiplier += 5;
        continue;
      }

      // all other errors should just be stored for the very end
      errors.push([pageUrl.url, e]);
      temporaryErrors = 0;
      continue;
    }

    // each successful run lowers the delay multiplier a bit
    delayMultiplier = Math.max(10, delayMultiplier - 1);
    temporaryErrors = 0;

    const cleanedContent = cleanContent(pageContent.content);

    // Skip if content is empty after cleaning
    if (!cleanedContent) {
      console.log(`Skipping ${pageUrl.url} - no valid content`);
      continue;
    }

    const pageData: PageData = {
      url: pageUrl.url,
      content: cleanedContent,
      title: pageContent.title,
      site,
      lastModified: pageUrl.lastModified || new Date(),
      createdAt: new Date(),
    };

    writeDocsPage(dataDir, pageData);
    console.log(`Stored ${pageUrl.url}`);
  }

  return errors;
}
