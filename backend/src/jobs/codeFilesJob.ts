import { github } from "../../../shared/index.js";
import { env } from "../env.js";
import { fetchCodeFiles } from "../scripts/fetchCodeFiles.js";

const DATA_DIR = process.env.DATA_DIR || "./data";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in code files job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running code files fetch job at", new Date().toISOString());

  const errors: unknown[] = [];
  for (const config of github.REPOSITORIES) {
    if (!config.indexCode) continue;
    try {
      console.log(`Fetching code from ${config.owner}/${config.repo}...`);
      const count = await fetchCodeFiles({
        owner: config.owner,
        repo: config.repo,
        defaultBranch: config.defaultBranch,
        dataDir: DATA_DIR,
        githubToken: env.GITHUB_TOKEN,
      });
      console.log(`Successfully processed ${config.owner}/${config.repo}: ${count} chunks`);
    } catch (error) {
      console.error(`Error processing ${config.owner}/${config.repo}:`, error);
      errors.push(error);
    }
  }

  console.log("Code files fetch job completed");
  if (errors.length) {
    throw errors;
  }
}
