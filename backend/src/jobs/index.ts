import type { Job } from "node-schedule";
import { setupDiscordJob } from "./discordJob.js";
import { setupDocsPagesJob } from "./docsPagesJob.js";
import { setupGithubPagesJob } from "./githubPagesJob.js";
import { setupGraypaperJob } from "./graypaperJob.js";
import { setupMatrixJob } from "./matrixJob.js";

export interface CronJobs {
  matrixJob: Job | null;
  graypaperJob: Job | null;
  githubPagesJob: Job | null;
  docsPagesJob: Job | null;
  discordJob: Job | null;
}

export function setupCronJobs(): CronJobs {
  return {
    matrixJob: setupMatrixJob(),
    graypaperJob: setupGraypaperJob(),
    githubPagesJob: setupGithubPagesJob(),
    docsPagesJob: setupDocsPagesJob(),
    discordJob: setupDiscordJob(),
  };
}
