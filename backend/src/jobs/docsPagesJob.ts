import { PAGES } from "../../../shared/pages.js";
import {
  discoverLinks,
  FetchError,
  fetchAndStorePages,
} from "../scripts/fetchPages.js";

const DATA_DIR = process.env.DATA_DIR || "./data";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in docs pages job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running docs pages fetch job at", new Date().toISOString());

  const errors: [string, Error][] = [];

  for (const page of PAGES) {
    if (page.skipIndexing) {
      console.warn(
        `⚠️  Skipping ${page.dbId} - site is configured to skip indexing updates`
      );
      continue;
    }

    if (page.kind === "sitemap") {
      console.log(`Fetching sitemap of ${page.dbId} ...`);
      errors.push(
        ...(await fetchAndStorePages(
          {
            sitemapUrl: page.sitemapUrl,
          },
          page.dbId,
          DATA_DIR
        ))
      );
      continue;
    }

    if (page.kind === "url") {
      console.log(`Discovering links for ${page.dbId} ...`);
      let links: string[];
      try {
        links = await discoverLinks(page.url);
      } catch (e) {
        errors.push([
          page.url,
          e instanceof FetchError ? e : new FetchError(String(e), 0),
        ]);
        continue;
      }

      console.log(`Found ${links.length} URLs for ${page.url}`);
      errors.push(...(await fetchAndStorePages(links, page.dbId, DATA_DIR)));

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
}

function assertNever(_page: never) {}
