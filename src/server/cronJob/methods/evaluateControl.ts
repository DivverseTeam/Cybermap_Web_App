import { runIso27001 } from "~/server/api/routers/controls/iso27001";

export async function performAudit() {
  await runIso27001();
}
