import cron from "node-cron";
import { performAudit } from "./methods/evaluateControl";

let isCronRunning = false;

const startHourlyEvaluation = cron.schedule("0 * * * *", async () => {
  console.log("Running a task every one hour");
  await performAudit();
});

export function StartCron() {
  if (!isCronRunning) {
    startHourlyEvaluation.stop();
    startHourlyEvaluation.start();
    isCronRunning = true;
    console.log("Cron job started");
  } else {
    console.log("Cron job is already running");
  }
}
