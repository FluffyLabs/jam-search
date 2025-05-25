import { Octokit } from "@octokit/rest";
import { sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";

export interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
}

export interface GitHubContent {
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
  type: "issue" | "pull_request";
}

function shouldSkipContent(body: string): boolean {
  const skipPatterns = [
    /^Closes https:\/\/github\.com/i,
    /^### ⚠️ Temporarily closed in favor of https:\/\/github\.com/i,
  ];

  return skipPatterns.some((pattern) => pattern.test(body.trim()));
}

export async function fetchGitHubContent(
  config: GitHubConfig
): Promise<GitHubContent[]> {
  const octokit = new Octokit({
    auth: config.token || process.env.GITHUB_TOKEN,
  });

  const content: GitHubContent[] = [];

  // Fetch all issues (including pull requests)
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: config.owner,
    repo: config.repo,
    state: "all",
    per_page: 100,
  });

  // Process each issue/PR
  for (const item of issues) {
    // Skip items with no body or no user
    if (!item.body || !item.user || shouldSkipContent(item.body)) continue;

    // Determine if it's a PR or an issue
    const isPR = "pull_request" in item;
    const type = isPR ? "pull_request" : "issue";

    // Fetch regular comments
    const regularComments = await octokit.paginate(
      octokit.rest.issues.listComments,
      {
        owner: config.owner,
        repo: config.repo,
        issue_number: item.number,
        per_page: 100,
      }
    );

    // If it's a PR, fetch review comments
    let reviewComments: Array<{ body: string; user: { login: string } }> = [];
    if (isPR) {
      const prReviewComments = await octokit.paginate(
        octokit.rest.pulls.listReviewComments,
        {
          owner: config.owner,
          repo: config.repo,
          pull_number: item.number,
          per_page: 100,
        }
      );

      // Convert review comments to the same format as regular comments
      reviewComments = prReviewComments
        .filter((rc) => rc.user)
        .map((rc) => ({
          body: rc.body || rc.diff_hunk || "",
          user: { login: rc.user?.login },
        }));
    }

    // Combine and filter all comments
    const validComments = [
      ...regularComments
        .filter((comment) => comment.body && comment.user)
        .map((comment) => ({
          body: comment.body || "",
          user: { login: comment.user?.login || "" },
        })),
      ...reviewComments,
    ];

    content.push({
      number: item.number,
      title: item.title,
      body: item.body,
      html_url: item.html_url,
      user: { login: item.user.login },
      comments: validComments,
      type,
    });
  }

  return content;
}

export async function storeContentInDatabase(
  content: GitHubContent[],
  site: string
) {
  await db.transaction(async (tx) => {
    for (const item of content) {
      // Create content with body and comments using markdown formatting
      const content = [
        "",
        `# ${item.title}`,
        "",
        `## ${item.type === "pull_request" ? "Pull Request" : "Issue"} by @${
          item.user.login
        }`,
        "",
        item.body,
        "",
        ...item.comments.map((comment) =>
          [
            "",
            `## Comment by @${comment.user.login}`,
            "",
            comment.body,
            "",
          ].join("\n")
        ),
      ].join("\n");

      await tx
        .insert(pagesTable)
        .values({
          url: item.html_url,
          content: content,
          title: item.title,
          site,
          lastModified: new Date(),
        })
        .onConflictDoUpdate({
          target: pagesTable.url,
          set: {
            content: content,
            title: item.title,
            site,
            lastModified: new Date(),
          },
        });
    }

    console.log("Reindexing pages_search_idx");
    await tx.execute(sql`REINDEX INDEX pages_search_idx;`);
  });
}
