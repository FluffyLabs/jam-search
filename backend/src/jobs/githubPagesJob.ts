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

    const repositories = [
      {
        owner: "w3f",
        repo: "jamtestvectors",
        token: process.env.GITHUB_TOKEN,
      },
      {
        owner: "w3f",
        repo: "jam-milestone-delivery",
        token: process.env.GITHUB_TOKEN,
      },
    ];

    for (const config of repositories) {
      try {
        console.log(`Fetching content from ${config.owner}/${config.repo}...`);

        const content = await fetchGitHubContent(config);
        console.log(
          `Found ${content.length} items from ${config.owner}/${config.repo} (${
            content.filter((c) => c.type === "pull_request").length
          } PRs, ${content.filter((c) => c.type === "issue").length} issues)`
        );

        await storeContentInDatabase(
          content,
          `github.com/${config.owner}/${config.repo}`
        );
        console.log(`Successfully processed ${config.owner}/${config.repo}`);
      } catch (error) {
        console.error(
          `Error processing ${config.owner}/${config.repo}:`,
          error
        );
        // Continue with next repository even if one fails
      }
    }

    console.log("GitHub pages fetch job completed");
  });
}
