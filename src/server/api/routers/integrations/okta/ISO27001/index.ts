import { oktaClient, TIME_FRAME } from "../init";

async function getAccessControlLogs(timeFrame: string) {
  try {
    const logs = await oktaClient.getLogs({
      since: timeFrame,
      filter:
        'eventType eq "user.session.start" or eventType eq "user.authentication.sso"',
    });

    const accessLogs = [];
    await logs.each((log) => accessLogs.push(log));
    return accessLogs;
  } catch (error) {
    console.error("Error fetching access control logs:", error);
    throw error;
  }
}

async function getMFAEnforcementLogs(timeFrame: string) {
  try {
    const logs = await oktaClient.getLogs({
      since: timeFrame,
      filter:
        'eventType eq "user.mfa.factor.verify" or eventType eq "user.mfa.attempt.success"',
    });

    const mfaLogs = [];
    await logs.each((log) => mfaLogs.push(log));
    return mfaLogs;
  } catch (error) {
    console.error("Error fetching MFA enforcement logs:", error);
    throw error;
  }
}

async function getAccessControlEvidence() {
  try {
    const accessControlLogs = await getAccessControlLogs(TIME_FRAME);
    console.log("Access Control Logs:", accessControlLogs);

    const mfaEnforcementLogs = await getMFAEnforcementLogs(TIME_FRAME);
    console.log("MFA Enforcement Logs:", mfaEnforcementLogs);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getAccessControlEvidence };