import { Event, LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { GetComplianceDetailsByConfigRuleCommand } from "@aws-sdk/client-config-service";
import { cloudTrailClient, configServiceClient, iamClient } from "../init";
import {
  GetUserPolicyCommand,
  ListAccessKeysCommand,
  ListAttachedRolePoliciesCommand,
  ListPoliciesCommand,
  ListPolicyTagsCommand,
  ListRolesCommand,
  ListUsersCommand,
} from "@aws-sdk/client-iam";

// Logs of security risk assessments: Evidence that risk analysis is performed regularly.
async function getComplianceDetailsByConfigRule(ruleName: string) {
  try {
    const params = {
      ConfigRuleName: ruleName, // Replace with your specific config rule name
    };

    const command = new GetComplianceDetailsByConfigRuleCommand(params);
    const data = await configServiceClient.send(command);
    return data;
  } catch (error) {
    console.error("Error fetching compliance details:", error);
    throw error;
  }
}

// Logs of security risk assessments: Evidence that risk analysis is performed regularly.
async function getEncryptionAndAccessControlCompliance() {
  try {
    const encryptionCompliance = await getComplianceDetailsByConfigRule(
      "EncryptionRule"
    );

    const accessControlCompliance = await getComplianceDetailsByConfigRule(
      "AccessControlRule"
    );

    return {
      encryptionCompliance,
      accessControlCompliance,
    };
  } catch (error) {
    console.error("Error fetching compliance details:", error);
    throw error;
  }
}

// Audit trails: Logs showing risk mitigation actions.
async function lookupEvents(startTime: Date, endTime: Date) {
  try {
    const params = {
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
      MaxResults: 50,
    } as any;

    const command = new LookupEventsCommand(params);
    let data = await cloudTrailClient.send(command);
    let events: Event[] = [];

    do {
      const command = new LookupEventsCommand(params);
      data = await cloudTrailClient.send(command);
      if (data.Events) {
        events = events.concat(data.Events);
      }
      params.NextToken = data.NextToken;
    } while (data.NextToken); // Fetch all pages
    return events;
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
    throw error;
  }
}

// Audit trails: Logs showing risk mitigation actions.
async function fetchSecurityEvents(startTime: Date, endTime: Date) {
  try {
    const events = await lookupEvents(startTime, endTime);
    if (!events) return [];

    const securityActions = events.filter((event) => {
      const eventName =
        (event?.EventName && event?.EventName.toLowerCase()) || "";
      return [
        "createuser",
        "deleteuser",
        "putuserpolicy",
        "putrolepolicy",
        "updateaccesskey",
        "putbucketencryption",
        "modifyinstanceattribute",
        "authorizesecuritygroupingress",
        "revokesecuritygroupingress",
      ].some((action) => eventName.includes(action));
    });

    return securityActions;
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
    throw error;
  }
}

// Role-based access control (RBAC): Ensure access to PHI is based on user roles.
async function listRoles() {
  try {
    const command = new ListRolesCommand({});
    const response = await iamClient.send(command);
    console.log("Roles:", response.Roles);
    return response.Roles;
  } catch (error) {
    console.error("Error listing roles:", error);
    throw error;
  }
}

async function listPoliciesForRole(roleName: string) {
  try {
    const command = new ListAttachedRolePoliciesCommand({ RoleName: roleName });
    const response = await iamClient.send(command);
    console.log(`Policies for role ${roleName}:`, response.AttachedPolicies);
    return response.AttachedPolicies;
  } catch (error) {
    console.error(`Error listing policies for role ${roleName}:`, error);
    throw error;
  }
}

// Role-based access control (RBAC): Ensure access to PHI is based on user roles.
async function getUserPolicy(userName: string, policyName: string) {
  try {
    const command = new GetUserPolicyCommand({
      UserName: userName,
      PolicyName: policyName,
    });
    const response = await iamClient.send(command);
    console.log(
      `Policy ${policyName} for user ${userName}:`,
      response.PolicyDocument
    );
    return response.PolicyDocument;
  } catch (error) {
    console.error(
      `Error getting policy ${policyName} for user ${userName}:`,
      error
    );
    throw error;
  }
}

// Role-based access control (RBAC): Ensure access to PHI is based on user roles.
async function listPHIRelatedPolicies(tagKey: string, tagValue: string) {
  try {
    const policiesResponse = await iamClient.send(
      new ListPoliciesCommand({ Scope: "Local" })
    );
    const policies = policiesResponse.Policies;
    if (!policies) return [];

    // Fetch policies with specific tags (e.g., PHI-related)
    const phiPolicies = [];
    for (const policy of policies) {
      const policyTagsResponse = await iamClient.send(
        new ListPolicyTagsCommand({ PolicyArn: policy.Arn })
      );
      if (!policyTagsResponse?.Tags) continue;
      const hasPHITag = policyTagsResponse.Tags.some(
        (tag) => tag.Key === tagKey && tag.Value === tagValue
      );
      if (hasPHITag) {
        phiPolicies.push(policy);
      }
    }

    console.log("PHI-Related Policies:", phiPolicies);
    return phiPolicies;
  } catch (error) {
    console.error("Error listing PHI-related policies:", error);
    throw error;
  }
}

// Authorization: Ensure only authorized users can access PHI.
// Deactivation Records: Confirm inactive users' accounts are deactivated.
// Function to list all users
const getAllUsers = async () => {
  try {
    const command = new ListUsersCommand({});
    const response = await iamClient.send(command);
    return response.Users; // Array of user details
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Authorization: Ensure only authorized users can access PHI.
// Deactivation Records: Confirm inactive users' accounts are deactivated.
// Function to list access keys for a specific user
const getAccessKeysForUser = async (userName: string) => {
  try {
    const command = new ListAccessKeysCommand({ UserName: userName });
    const response = await iamClient.send(command);
    return response.AccessKeyMetadata; // Array of access keys for the user
  } catch (error) {
    console.error(`Error fetching access keys for user ${userName}:`, error);
    throw error;
  }
};

// Authorization: Ensure only authorized users can access PHI.
// Deactivation Records: Confirm inactive users' accounts are deactivated.
// Main function to fetch evidence
const fetchWorkforceSecurityEvidence = async () => {
  try {
    const users = await getAllUsers();
    console.log("Users List:", users);
    if(!users) return;

    for (const user of users) {
      if(!user.UserName) continue;
      console.log(`Fetching access keys for user: ${user.UserName}`);
      const accessKeys = await getAccessKeysForUser(user.UserName);
      console.log(`Access Keys for ${user.UserName}:`, accessKeys);
    }

    console.log("Evidence collection completed.");
  } catch (error) {
    console.error("Error during evidence collection:", error);
  }
};
