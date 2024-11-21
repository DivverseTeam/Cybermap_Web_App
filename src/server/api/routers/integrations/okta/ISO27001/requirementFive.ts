// Access Control
// Ensure that access to information and systems is based on business needs, and enforce policies such as least privilege,
// multi - factor authentication(MFA), and user account management

import { oktaApi, TIME_FRAME } from "../init";

// Function to get logs showing who accessed which systems and when
async function getAccessControlLogs(timeFrame: string) {
  try {
    const logs = await oktaApi.get("/logs", {
      params: {
        since: timeFrame,
        filter:
          'eventType eq "user.session.start" or eventType eq "system.access.grant"',
      },
    });
    return logs.data.map((log: any) => ({
      timestamp: log.published,
      user: log.actor.displayName,
      action: log.eventType,
      system: log.target.map((t: any) => t.displayName).join(", "),
    }));
  } catch (error) {
    console.error("Error fetching access control logs:", error);
    throw error;
  }
}

// Function to get logs proving MFA enforcement
async function getMfaEnforcementLogs(timeFrame: string) {
  try {
    const logs = await oktaApi.get("/logs", {
      params: {
        since: timeFrame,
        filter: 'eventType eq "user.authentication.auth_via_mfa"',
      },
    });
    return logs.data.map((log: any) => ({
      timestamp: log.published,
      user: log.actor.displayName,
      factorType: log.outcome.reason,
      system: log.target.map((t: any) => t.displayName).join(", "),
    }));
  } catch (error) {
    console.error("Error fetching MFA enforcement logs:", error);
    throw error;
  }
}

async function getAccessControlEvidence() {
  try {
    const accessControlLogs = await getAccessControlLogs(TIME_FRAME);
    console.log("Access Control Logs:", accessControlLogs);

    const mfaEnforcementLogs = await getMfaEnforcementLogs(TIME_FRAME);
    console.log("MFA Enforcement Logs:", mfaEnforcementLogs);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getAccessControlEvidence };
