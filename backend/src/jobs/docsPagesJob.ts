import FirecrawlApp, { type FirecrawlError } from "firecrawl";
import { PAGES } from "../../../shared/pages.js";
import { db } from "../db/db.js";
import { env } from "../env.js";
import { fetchAndStorePages } from "../scripts/fetchPages.js";

const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in docs pages job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running docs pages fetch job at", new Date().toISOString());

  const firecrawl = new FirecrawlApp({
    apiKey: FIRECRAWL_API_KEY,
  });
  const errors: [string, FirecrawlError][] = [];

  for (const page of PAGES) {
    if (page.kind === "sitemap") {
      console.log(`Fetching sitemap of ${page.dbId} ...`);
      errors.push(
        ...(await fetchAndStorePages(
          firecrawl,
          {
            sitemapUrl: page.sitemapUrl,
          },
          page.dbId
        ))
      );
      continue;
    }

    if (page.kind === "url") {
      console.log(`Mapping ${page.dbId} to get all URLs...`);
      const map = await firecrawl.mapUrl(page.url);

      if (map.success && map.links) {
        console.log(`Found ${map.links.length} URLs for ${page.url}`);
        errors.push(
          ...(await fetchAndStorePages(firecrawl, map.links, page.dbId))
        );
        continue;
      }

      throw new Error(`Failed to map: ${page.dbId}: ${map.error}`);
    }

    assertNever(page);
  }

  if (errors.length) {
    for (const [url, e] of errors) {
      console.error(`Failed to fetch ${url}: ${e}`);
    }

    throw new Error(`Finished with ${errors.length} errors.`);
  }

  console.log("Docs pages fetch job completed successfully");
  await db.$client.end();
}

function assertNever(_page: never) {}
