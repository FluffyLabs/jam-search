import { Octokit } from "@octokit/rest";
import { type PageData, writeGithubPage } from "../data/writer.js";

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
  const auth = config.token || process.env.GITHUB_TOKEN;
  return await fetchGitHubContentWithOctokit(new Octokit({ auth }), config);
}

async function fetchGitHubContentWithOctokit(
  octokit: Octokit,
  config: GitHubConfig
): Promise<GitHubContent[]> {
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

  // Fetch discussions (requires authentication via GraphQL)
  const discussions = await fetchDiscussions(octokit, config);
  content.push(...discussions);

  return content;
}

export function storeContentInMarkdown(
  content: GitHubContent[],
  site: string,
  owner: string,
  repo: string,
  dataDir: string
) {
  for (const item of content) {
    // Create content with body and comments using markdown formatting
    const typeLabel =
      item.type === "pull_request"
        ? "Pull Request"
        : item.type === "discussion"
          ? "Discussion"
          : "Issue";

    const markdownContent = [
      "",
      `# ${item.title}`,
      "",
      `## ${typeLabel} by @${item.user.login}`,
      "",
      item.body,
      "",
      ...item.comments.map((comment) =>
        ["", `## Comment by @${comment.user.login}`, "", comment.body, ""].join(
          "\n"
        )
      ),
    ].join("\n");

    const lastModified = new Date(item.created_at);
    const type =
      item.type === "pull_request"
        ? "pr"
        : item.type === "discussion"
          ? "discussion"
          : "issue";

    const pageData: PageData = {
      url: item.html_url,
      content: markdownContent,
      title: item.title,
      site,
      createdAt: new Date(item.created_at),
      lastModified,
    };

    writeGithubPage(dataDir, owner, repo, type, item.number, pageData);
  }

  console.log(`Wrote ${content.length} GitHub pages to markdown`);
}
