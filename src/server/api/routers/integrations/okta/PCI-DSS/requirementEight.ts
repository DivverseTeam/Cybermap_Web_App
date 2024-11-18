// Requirement 8: Identify and authenticate access to system components

import { oktaApi, TIME_FRAME } from "../init";

// Function to get user authentication logs (login attempts, MFA enforcement, user ID assignments)
async function getUserAuthenticationLogs(timeFrame: string) {
  try {
    const logs = await oktaApi.get("/logs", {
      params: {
        since: timeFrame,
        filter: [
          'eventType eq "user.authentication.success"',
          'eventType eq "user.authentication.failure"',
          'eventType eq "user.authentication.auth_via_mfa"',
          'eventType eq "user.lifecycle.create"',
        ].join(" or "),
      },
    });

    return logs.data.map((log: any) => ({
      timestamp: log.published,
      user: log.actor.displayName,
      eventType: log.eventType,
      outcome: log.outcome.result,
      target: log.target.map((t: any) => t.displayName).join(", "),
    }));
  } catch (error) {
    console.error("Error fetching user authentication logs:", error);
    throw error;
  }
}

// Function to get and verify password policies
async function getPasswordPolicies() {
  try {
    const policies = await oktaApi.get("/policies", {
      params: {
        type: "PASSWORD",
      },
    });

    return policies.data.map((policy: any) => ({
      policyId: policy.id,
      policyName: policy.name,
      complexityRequirements: {
        minLength: policy.settings.password?.minLength,
        minLowerCase: policy.settings.password?.complexity?.minLowerCase,
        minUpperCase: policy.settings.password?.complexity?.minUpperCase,
        minNumber: policy.settings.password?.complexity?.minNumber,
        minSymbol: policy.settings.password?.complexity?.minSymbol,
      },
      lockoutPolicy: {
        maxAttempts: policy.settings.password?.lockout?.maxAttempts,
        lockoutDuration: policy.settings.password?.lockout?.autoUnlockMinutes,
      },
      enforcement: policy.status,
    }));
  } catch (error) {
    console.error("Error fetching password policies:", error);
    throw error;
  }
}

async function getEvidence() {
  try {
    const userAuthenticationLogs = await getUserAuthenticationLogs(TIME_FRAME);
    console.log("User Authentication Logs:", userAuthenticationLogs);

    const passwordPolicies = await getPasswordPolicies();
    console.log("Password Policies:", passwordPolicies);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getEvidence };
