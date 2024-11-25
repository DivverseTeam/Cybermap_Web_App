import {
  ListAttachedUserPoliciesCommand,
  GetPolicyCommand,
  ListRolesCommand,
  ListAttachedRolePoliciesCommand,
} from "@aws-sdk/client-iam";
import { cloudTrailClient, iamClient } from "../init";
import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";

// Access Control Policies: Logs showing restricted access based on roles
async function getAccessControlPolicies(userName: string) {
  try {
    const command = new ListAttachedUserPoliciesCommand({ UserName: userName });
    const userPolicies = await iamClient.send(command);
    if (!userPolicies.AttachedPolicies) {
      return [];
    }
    const policies = await Promise.all(
      userPolicies.AttachedPolicies.map(async (policy) => {
        const command2 = new GetPolicyCommand({ PolicyArn: policy.PolicyArn });
        const policyDetails = await iamClient.send(command2);
        return policyDetails.Policy;
      })
    );
    return policies;
  } catch (error) {
    console.error("Error fetching access control policies:", error);
    throw error;
  }
}

// Role-based Access Control (RBAC): Evidence of policies defining role-based permissions
async function getRoleBasedAccessControl() {
  try {
    const command = new ListRolesCommand({});
    const roles = await iamClient.send(command);
    if (!roles.Roles) {
      return [];
    }
    const rolePolicies = await Promise.all(
      roles.Roles.map(async (role) => {
        const command2 = new ListAttachedRolePoliciesCommand({
          RoleName: role.RoleName,
        });
        const policies = await iamClient.send(command2);
        return {
          RoleName: role.RoleName,
          Policies: policies.AttachedPolicies,
        };
      })
    );
    return rolePolicies;
  } catch (error) {
    console.error("Error fetching role-based access control:", error);
    throw error;
  }
}

// Audit Logs: Logs of access to cardholder data
async function getAuditLogs(
  startTime: Date,
  endTime: Date,
  lookupAttribute: string
) {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
      LookupAttributes: [
        {
          AttributeKey: "ResourceName",
          AttributeValue: lookupAttribute,
        },
      ],
    });
    const events = await cloudTrailClient.send(command);
    return events.Events;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
}

// AWS IAM Evidence: User Roles, Permissions, and Access Policies
async function getIamEvidence(userName: string) {
  try {
    const command = new ListRolesCommand({});
    const roles = await iamClient.send(command);
    const userPolicies = await getAccessControlPolicies(userName);
    return { roles: roles.Roles, userPolicies };
  } catch (error) {
    console.error("Error fetching IAM evidence:", error);
    throw error;
  }
}

// AWS CloudTrail Evidence: Track user access and changes to permissions
async function getCloudTrailEvents(startTime: Date, endTime: Date) {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
    });
    const events = await cloudTrailClient.send(command);
    return events.Events;
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
    throw error;
  }
}

export async function getEvidence() {
  const userName = "test-user";
  const startTime = new Date("2023-01-01");
  const endTime = new Date();

  try {
    const accessPolicies = await getAccessControlPolicies(userName);
    console.log("Access Control Policies:", accessPolicies);

    const rbacPolicies = await getRoleBasedAccessControl();
    console.log("RBAC Policies:", rbacPolicies);

    const auditLogs = await getAuditLogs(startTime, endTime, "cardholder-data");
    console.log("Audit Logs:", auditLogs);

    const iamEvidence = await getIamEvidence(userName);
    console.log("IAM Evidence:", iamEvidence);

    const cloudTrailEvents = await getCloudTrailEvents(startTime, endTime);
    console.log("CloudTrail Events:", cloudTrailEvents);
    return { accessPolicies, rbacPolicies, auditLogs, iamEvidence, cloudTrailEvents };
  } catch (error) {
    console.error("Error gathering evidence:", error);
  }
}
