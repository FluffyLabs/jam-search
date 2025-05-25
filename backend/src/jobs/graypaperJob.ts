import { type Job, scheduleJob } from "node-schedule";
import { updateGraypapers } from "../scripts/updateGraypapers.js";

export function setupGraypaperJob(): Job {
  return scheduleJob("0 0 * * *", async () => {
    console.log(
      "Running scheduled graypaper update job at",
      new Date().toISOString()
    );
    try {
      await updateGraypapers();
      console.log("Graypaper update job completed successfully");
    } catch (error) {
      console.error("Error in graypaper update job:", error);
    }
  });
}
