import FirecrawlApp, { FirecrawlError } from "firecrawl";
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

/**
 * Execute the docs pages fetch job by mapping or downloading pages listed in PAGES and storing their results.
 *
 * For each entry in PAGES this function either fetches a sitemap or maps a URL to discover links, then delegates storage to fetchAndStorePages. It collects any per-page failures, logs them, and if any failures occurred throws an Error summarizing the number of errors; when no failures occur it closes the database client.
 *
 * @throws Error - If one or more page fetches or mappings failed; the thrown error's message contains the number of failures.
 */
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
      } else {
        errors.push([
          page.url,
          new FirecrawlError(map.error ?? "", 0, "Unable to index page."),
        ]);
      }

      continue;
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
