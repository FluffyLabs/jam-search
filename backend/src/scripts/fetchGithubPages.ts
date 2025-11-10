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
  created_at: string;
  comments: Array<{
    body: string;
    user: {
      login: string;
    };
    created_at: string;
  }>;
  type: "issue" | "pull_request" | "discussion";
}

interface GraphQLDiscussionsResponse {
  repository: {
    discussions: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<{
        number: number;
        title: string;
        body: string;
        url: string;
        author: {
          login: string;
        } | null;
        createdAt: string;
        comments: {
          nodes: Array<{
            body: string;
            author: {
              login: string;
            } | null;
            createdAt: string;
            replies: {
              nodes: Array<{
                body: string;
                author: {
                  login: string;
                } | null;
                createdAt: string;
              }>;
            };
          }>;
        };
      }>;
    };
  };
}

function shouldSkipContent(body: string): boolean {
  const skipPatterns = [
    /^Closes https:\/\/github\.com/i,
    /^### ⚠️ Temporarily closed in favor of https:\/\/github\.com/i,
  ];

  return skipPatterns.some((pattern) => pattern.test(body.trim()));
}

async function fetchDiscussions(
  octokit: Octokit,
  config: GitHubConfig
): Promise<GitHubContent[]> {
  const discussions: GitHubContent[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const query = `
      query($owner: String!, $repo: String!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 5, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              number
              title
              body
              url
              author {
                login
              }
              createdAt
              comments(first: 100) {
                nodes {
                  body
                  author {
                    login
                  }
                  createdAt
                  replies(first: 100) {
                    nodes {
                      body
                      author {
                        login
                      }
                      createdAt
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response: GraphQLDiscussionsResponse = await octokit.graphql(query, {
      owner: config.owner,
      repo: config.repo,
      cursor,
    });

    const discussionNodes = response.repository.discussions.nodes;

    for (const discussion of discussionNodes) {
      // Skip discussions with no body or no author
      if (
        !discussion.body ||
        !discussion.author ||
        shouldSkipContent(discussion.body)
      ) {
        continue;
      }

      // Collect all comments including replies
      const allComments: Array<{
        body: string;
        user: { login: string };
        created_at: string;
      }> = [];

      for (const comment of discussion.comments.nodes) {
        if (comment.body && comment.author) {
          allComments.push({
            body: comment.body,
            user: { login: comment.author.login },
            created_at: comment.createdAt,
          });

          // Add replies
          for (const reply of comment.replies.nodes) {
            if (reply.body && reply.author) {
              allComments.push({
                body: reply.body,
                user: { login: reply.author.login },
                created_at: reply.createdAt,
              });
            }
          }
        }
      }

      discussions.push({
        number: discussion.number,
        title: discussion.title,
        body: discussion.body,
        html_url: discussion.url,
        user: { login: discussion.author.login },
        created_at: discussion.createdAt,
        comments: allComments,
        type: "discussion",
      });
    }

    hasNextPage = response.repository.discussions.pageInfo.hasNextPage;
    cursor = response.repository.discussions.pageInfo.endCursor;
  }

  return discussions;
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
    let reviewComments: Array<{
      body: string;
      user: { login: string };
      created_at: string;
    }> = [];
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
          created_at: rc.created_at,
        }));
    }

    // Combine and filter all comments
    const validComments = [
      ...regularComments
        .filter((comment) => comment.body && comment.user)
        .map((comment) => ({
          body: comment.body || "",
          user: { login: comment.user?.login || "" },
          created_at: comment.created_at,
        })),
      ...reviewComments,
    ];

    content.push({
      number: item.number,
      title: item.title,
      body: item.body,
      html_url: item.html_url,
      user: { login: item.user.login },
      created_at: item.created_at,
      comments: validComments,
      type,
    });
  }

  // Fetch discussions
  const discussions = await fetchDiscussions(octokit, config);
  content.push(...discussions);

  return content;
}

export async function storeContentInDatabase(
  content: GitHubContent[],
  site: string
) {
  await db.transaction(async (tx) => {
    for (const item of content) {
      // Create content with body and comments using markdown formatting
      const typeLabel =
        item.type === "pull_request"
          ? "Pull Request"
          : item.type === "discussion"
            ? "Discussion"
            : "Issue";

      const content = [
        "",
        `# ${item.title}`,
        "",
        `## ${typeLabel} by @${item.user.login}`,
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

      // Find the latest date between the issue/PR and its comments
      //   Use original issue/PR date as last modified date
      //   const dates = [
      //     new Date(item.created_at),
      //     ...item.comments.map((comment) => new Date(comment.created_at)),
      //   ];
      const lastModified = new Date(item.created_at);

      await tx
        .insert(pagesTable)
        .values({
          url: item.html_url,
          content: content,
          title: item.title,
          site,
          created_at: new Date(item.created_at),
          lastModified,
        })
        .onConflictDoUpdate({
          target: pagesTable.url,
          set: {
            content: content,
            title: item.title,
            site,
            created_at: new Date(item.created_at),
            lastModified,
          },
        });
    }

    console.log("Reindexing pages_search_idx");
    await tx.execute(sql`REINDEX INDEX pages_search_idx;`);
  });
}
