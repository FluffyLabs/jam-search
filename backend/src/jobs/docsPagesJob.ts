import { type Job, scheduleJob } from "node-schedule";
import FirecrawlApp from "firecrawl";
import { fetchAndStorePages } from "../scripts/fetchPages.js";

export function setupDocsPagesJob(): Job {
  return scheduleJob("0 2 * * 4", async () => {
    console.log(
      "Running scheduled docs pages fetch job at",
      new Date().toISOString()
    );
    try {
      // Keep original sitemap approach for docs.jamcha.in
      await fetchAndStorePages(
        {
          sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
        },
        "docs.jamcha.in"
      );

      // Use Firecrawl to map jam.web3.foundation and get all URLs
      const firecrawl = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY,
      });
      console.log("Mapping jam.web3.foundation to get all URLs...");
      const jamMapResult = await firecrawl.mapUrl(
        "https://jam.web3.foundation"
      );
      if (jamMapResult.success && jamMapResult.links) {
        console.log(
          `Found ${jamMapResult.links.length} URLs for jam.web3.foundation`
        );
        await fetchAndStorePages(jamMapResult.links, "jam.web3.foundation");
      } else {
        console.error("Failed to map jam.web3.foundation:", jamMapResult.error);
      }

      console.log("Docs pages fetch job completed successfully");
    } catch (error) {
      console.error("Error in docs pages fetch job:", error);
    }
  });
}
