import { type Job, scheduleJob } from "node-schedule";
import {
  fetchGitHubContent,
  storeContentInDatabase,
} from "../scripts/fetchGithubPages.js";

export function setupGithubPagesJob(): Job {
  return scheduleJob("0 2 * * 1", async () => {
    console.log(
      "Running scheduled GitHub pages fetch job at",
      new Date().toISOString()
    );
    try {
      const config = {
        owner: "w3f",
        repo: "jamtestvectors",
        token: process.env.GITHUB_TOKEN,
      };

      const content = await fetchGitHubContent(config);
      console.log(
        `Found ${content.length} items (${
          content.filter((c) => c.type === "pull_request").length
        } PRs, ${content.filter((c) => c.type === "issue").length} issues)`
      );

      await storeContentInDatabase(
        content,
        `github.com/${config.owner}/${config.repo}`
      );
      console.log("GitHub pages fetch job completed successfully");
    } catch (error) {
      console.error("Error in GitHub pages fetch job:", error);
    }
  });
}
