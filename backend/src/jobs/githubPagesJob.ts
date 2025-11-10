import { github } from "../../../shared/index.js";
import { env } from "../env.js";
import {
  fetchGitHubContent,
  storeContentInDatabase,
} from "../scripts/fetchGithubPages.js";

const GITHUB_TOKEN = env.GITHUB_TOKEN;

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in GitHub pages job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running GitHub pages fetch job at", new Date().toISOString());

  const errors = [];
  for (const config of github.REPOSITORIES) {
    try {
      console.log(`Fetching content from ${config.owner}/${config.repo}...`);

      const content = await fetchGitHubContent({
        ...config,
        token: GITHUB_TOKEN,
      });
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
      console.error(`Error processing ${config.owner}/${config.repo}:`, error);
      errors.push(error);
      // Continue with next repository even if one fails
    }
  }

  console.log("GitHub pages fetch job completed");

  if (errors.length) {
    throw errors;
  }
}
