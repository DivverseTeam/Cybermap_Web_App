//  Do not use defaults for system passwords and other security parameters

import { oktaApi, TIME_FRAME } from "../init";

// Function to audit configurations for default settings or passwords
async function getConfigurationAuditEvidence() {
  try {
    const policies = await oktaApi.get("/policies");
    const auditResults = policies.data.map((policy: any) => {
      const isUsingDefault =
        policy.conditions?.authContext?.authLevel?.include?.includes("LOW");
      return {
        policyId: policy.id,
        policyName: policy.name,
        type: policy.type,
        usingDefaultSettings: isUsingDefault || false,
      };
    });
    return auditResults;
  } catch (error) {
    console.error("Error fetching configuration audit evidence:", error);
    throw error;
  }
}

// Function to get user management logs for password policies and changes
async function getUserManagementLogs(timeFrame: string) {
  try {
    const logs = await oktaApi.get("/logs", {
      params: {
        since: timeFrame,
        filter: [
          'eventType eq "policy.update.password"',
          'eventType eq "policy.evaluate.password"',
          'eventType eq "user.account.update_password"',
          'eventType eq "user.account.unlock"',
        ].join(" or "),
      },
    });

    return logs.data.map((log: any) => ({
      timestamp: log.published,
      user: log.actor.displayName,
      action: log.eventType,
      outcome: log.outcome.result,
    }));
  } catch (error) {
    console.error("Error fetching user management logs:", error);
    throw error;
  }
}

async function getEvidence() {
  try {
    const configAuditEvidence = await getConfigurationAuditEvidence();
    console.log("Configuration Audit Evidence:", configAuditEvidence);

    const userManagementLogs = await getUserManagementLogs(TIME_FRAME);
    console.log("User Management Logs:", userManagementLogs);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getEvidence };
