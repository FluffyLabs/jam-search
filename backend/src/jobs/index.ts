import { type Job } from "node-schedule";
import { setupMatrixJob } from "./matrixJob.js";
import { setupGraypaperJob } from "./graypaperJob.js";
import { setupGithubPagesJob } from "./githubPagesJob.js";
import { setupDocsPagesJob } from "./docsPagesJob.js";

export interface CronJobs {
  matrixJob: Job | null;
  graypaperJob: Job | null;
  githubPagesJob: Job | null;
  docsPagesJob: Job | null;
}

export function setupCronJobs(): CronJobs {
  return {
    matrixJob: setupMatrixJob(),
    graypaperJob: setupGraypaperJob(),
    githubPagesJob: setupGithubPagesJob(),
    docsPagesJob: setupDocsPagesJob(),
  };
}
