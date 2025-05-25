import { type Job, scheduleJob } from "node-schedule";
import { fetchAndStorePages } from "../scripts/fetchPages.js";

export function setupDocsPagesJob(): Job {
  return scheduleJob("0 2 * * 4", async () => {
    console.log(
      "Running scheduled docs pages fetch job at",
      new Date().toISOString()
    );
    try {
      await fetchAndStorePages(
        {
          sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
        },
        "docs.jamcha.in"
      );
      console.log("Docs pages fetch job completed successfully");
    } catch (error) {
      console.error("Error in docs pages fetch job:", error);
    }
  });
}
