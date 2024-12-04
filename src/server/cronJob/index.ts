import cron from "node-cron";
import { performAudit } from "./methods/evaluateControl";

// run every 1 hour
const startHourlyEvaluation = cron.schedule("0 * * * *", async () => {
  console.log("Running a task every one hour");
  await performAudit();
});

// const TestSender = cron.schedule('* * * * *', async () => {
//   console.log('Running a task every minute');
//     await performAudit();
// });

export function StartCron() {
  startHourlyEvaluation.start();
  // TestSender.start();
  console.log("Cron job started");
}
