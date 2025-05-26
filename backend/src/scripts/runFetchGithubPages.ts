import { db } from "../db/db.js";
import {
  type GitHubConfig,
  storeContentInDatabase,
} from "./fetchGithubPages.js";
import { fetchGitHubContent } from "./fetchGithubPages.js";

// Example usage:
const config: GitHubConfig = {
  owner: "w3f",
  repo: "jamtestvectors",
  token: process.env.GITHUB_TOKEN,
};

// Fetch and store GitHub content
fetchGitHubContent(config)
  .then(async (content) => {
    console.log(
      `Found ${content.length} items (${
        content.filter((c) => c.type === "pull_request").length
      } PRs, ${content.filter((c) => c.type === "issue").length} issues)`
    );
    await storeContentInDatabase(
      content,
      `github.com/${config.owner}/${config.repo}`
    );
    console.log("Done! Closing connection...");
    await db.$client.end();
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
