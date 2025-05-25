import { Octokit } from "@octokit/rest";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";
import { sql } from "drizzle-orm";

interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
}

interface IssueWithComments {
  number: number;
  title: string;
  body: string;
  html_url: string;
  user: {
    login: string;
  };
  comments: Array<{
    body: string;
    user: {
      login: string;
    };
  }>;
}

function shouldSkipIssue(body: string): boolean {
  const skipPatterns = [
    /^Closes https:\/\/github\.com/i,
    /^### ⚠️ Temporarily closed in favor of https:\/\/github\.com/i,
  ];

  return skipPatterns.some((pattern) => pattern.test(body.trim()));
}

async function fetchIssuesWithComments(
  config: GitHubConfig
): Promise<IssueWithComments[]> {
  const octokit = new Octokit({
    auth: config.token || process.env.GITHUB_TOKEN,
  });

  // Fetch all issues
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: config.owner,
    repo: config.repo,
    state: "all",
    per_page: 100,
  });

  // Fetch comments for each issue
  const issuesWithComments: IssueWithComments[] = [];

  for (const issue of issues) {
    // Skip issues with no body, no user, or matching skip patterns
    if (!issue.body || !issue.user || shouldSkipIssue(issue.body)) continue;

    const comments = await octokit.paginate(octokit.rest.issues.listComments, {
      owner: config.owner,
      repo: config.repo,
      issue_number: issue.number,
      per_page: 100,
    });

    // Filter out comments with no body or no user
    const validComments = comments
      .filter((comment) => comment.body && comment.user)
      .map((comment) => ({
        body: comment.body!,
        user: { login: comment.user!.login },
      }));

    issuesWithComments.push({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      html_url: issue.html_url,
      user: { login: issue.user.login },
      comments: validComments,
    });
  }

  return issuesWithComments;
}

async function storeIssuesInDatabase(
  issues: IssueWithComments[],
  site: string
) {
  await db.transaction(async (tx) => {
    for (const issue of issues) {
      // Create content with issue body and comments
      const content = [
        `Issue by ${issue.user.login}:`,
        issue.body,
        ...issue.comments.map(
          (comment) => `\nComment by ${comment.user.login}:\n${comment.body}`
        ),
      ].join("\n\n");

      await tx
        .insert(pagesTable)
        .values({
          url: issue.html_url,
          content: content,
          title: issue.title,
          site,
          lastModified: new Date(),
        })
        .onConflictDoUpdate({
          target: pagesTable.url,
          set: {
            content: content,
            title: issue.title,
            site,
            lastModified: new Date(),
          },
        });
    }

    console.log("Reindexing pages_search_idx");
    await tx.execute(sql`REINDEX INDEX pages_search_idx;`);
  });
}

// Example usage:
const config: GitHubConfig = {
  owner: "w3f",
  repo: "jamtestvectors",
  token: process.env.GITHUB_TOKEN,
};

// Fetch and store GitHub issues with comments
fetchIssuesWithComments(config)
  .then(async (issues) => {
    console.log(`Found ${issues.length} issues with comments`);
    await storeIssuesInDatabase(
      issues,
      `github.com/${config.owner}/${config.repo}`
    );
    console.log("Done! Closing connection...");
    await db.$client.end();
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
