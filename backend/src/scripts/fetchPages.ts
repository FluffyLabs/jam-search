import { setTimeout } from "node:timers/promises";
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
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
  const response = await fetch(sitemapUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
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

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

const FETCH_TIMEOUT_MS = 30_000;

async function fetchPageContent(
  url: string
): Promise<{ content: string; title: string }> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new FetchError(
      `HTTP ${response.status} ${response.statusText}`,
      response.status
    );
  }
  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();

  // Remove nav, header, footer, and script/style elements for cleaner markdown
  $("nav, header, footer, script, style, noscript").remove();

  // Prefer main/article content if available
  const main = $("main, article").first();
  const bodyHtml = main.length ? main.html() : $("body").html();

  const markdown = turndown.turndown(bodyHtml || "");
  return { content: markdown, title };
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function discoverLinks(rootUrl: string): Promise<string[]> {
  const response = await fetch(rootUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new FetchError(
      `HTTP ${response.status} ${response.statusText}`,
      response.status
    );
  }
  const html = await response.text();
  const $ = cheerio.load(html);

  const base = new URL(rootUrl);
  const links = new Set<string>();

  $("a[href]").each((_, el) => {
    try {
      const href = $(el).attr("href");
      if (!href) return;
      const resolved = new URL(href, base);
      // Only keep same-origin HTML links, strip hash/query
      if (resolved.origin === base.origin) {
        // Skip non-HTML resources
        const ext = resolved.pathname.split(".").pop()?.toLowerCase();
        if (
          ext &&
          [
            "pdf",
            "png",
            "jpg",
            "jpeg",
            "gif",
            "svg",
            "zip",
            "tar",
            "gz",
            "mp4",
            "webm",
          ].includes(ext)
        ) {
          return;
        }
        resolved.hash = "";
        resolved.search = "";
        links.add(resolved.toString());
      }
    } catch {
      // skip invalid URLs
    }
  });

  return [...links];
}

function cleanContent(content: string): string | null {
  // Remove both patterns:
  // 1. "[Skip to main content](url) On this page"
  // 2. "[Skip to main content](url)"
  const cleanedContent = content
    .replace(/\[Skip to main content\]\([^)]+\)\s*On this page/g, "")
    .replace(/\[Skip to main content\]\([^)]+\)/g, "")
    .replace(/^On this page\n*/m, "")
    .trim();

  // If content is empty or only contains whitespace after cleaning, return null
  if (!cleanedContent) {
    return null;
  }

  return cleanedContent;
}

export async function fetchAndStorePages(
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

  const MAX_RETRIES = 5;
  const retryCounts = new Map<string, number>();
  const errors: [string, Error][] = [];

  // Fetch and store each page
  for (;;) {
    const pageUrl = pageUrls.shift();
    // all pages processed, finish up.
    if (pageUrl === undefined) {
      break;
    }

    // Small delay between requests to be polite
    await delay(500);

    console.log(`Fetching ${pageUrl.url}`);
    let pageContent = { content: "", title: "" };
    try {
      pageContent = await fetchPageContent(pageUrl.url);
    } catch (e) {
      const fetchError =
        e instanceof FetchError ? e : new FetchError(String(e), 0);

      // Retry on rate-limit, temporary errors, or network failures (status 0)
      const isRetryable =
        fetchError.status === 0 ||
        fetchError.status === 429 ||
        fetchError.status === 408 ||
        fetchError.status === 502 ||
        fetchError.status === 503;
      if (isRetryable) {
        const retries = (retryCounts.get(pageUrl.url) ?? 0) + 1;
        retryCounts.set(pageUrl.url, retries);
        if (retries > MAX_RETRIES) {
          console.log(
            `Giving up on ${pageUrl.url} after ${MAX_RETRIES} retries`
          );
          errors.push([pageUrl.url, fetchError]);
          continue;
        }
        console.log(
          `HTTP ${fetchError.status} when fetching, will retry ${pageUrl.url}`
        );
        // Backoff: requeue at front (shift pops from front) with increasing delay
        await delay(1000 * 2 ** retries);
        pageUrls.push(pageUrl);
        continue;
      }

      // all other errors should just be stored for the very end
      errors.push([pageUrl.url, fetchError]);
      continue;
    }

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
