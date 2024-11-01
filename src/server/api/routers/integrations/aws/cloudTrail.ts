import {
  LookupAttribute,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { cloudTrailClient } from "./init";

// Login and activity logs

async function fetchLoginAttempts() {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "ConsoleLogin",
        },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;
    if (!events) return [];
    events.forEach((event: any) => {
      const loginStatus = event.responseElements.ConsoleLogin;
      console.log(`Login Attempt by ${event.username}: ${loginStatus}`, event);
    });
  } catch (error) {
    console.error("Error fetching login attempts:", error);
  }
}

async function fetchUserLoginAttempts(username: string) {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "ConsoleLogin",
        },
        {
          AttributeKey: "Username",
          AttributeValue: username,
        },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;

    if (!events) return [];
    events.forEach((event: any) => {
      const loginStatus = event.responseElements.ConsoleLogin;
      console.log(`Login Attempt by ${event.username}: ${loginStatus}`, event);
    });
  } catch (error) {
    console.error("Error fetching login attempts for user:", error);
  }
}

// Incident reports: Logs that detail security incidents and the responses taken.
// Function to get CloudTrail events indicating potential incidents
async function getCloudTrailEvents({
  lookupAttributes,
  startTime,
  endTime,
  maxResults,
}: {
  startTime: Date;
  endTime: Date;
  lookupAttributes: LookupAttribute[];
  maxResults: number;
}) {
  try {
    const lookupEventsCommand = new LookupEventsCommand({
      LookupAttributes: lookupAttributes,
      StartTime: startTime, // Last 24 hours
      EndTime: endTime,
      MaxResults: maxResults,
    });
    const events = await cloudTrailClient.send(lookupEventsCommand);
    console.log("CloudTrail Events:", events.Events);
    return { events: events.Events, nextToken: events.NextToken };
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
  }
}

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
/**
 * Retrieves CloudTrail logs of disaster recovery actions for tracking and auditing.
 */
async function getCloudTrailRecoveryLogs() {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        { AttributeKey: "EventName", AttributeValue: "StartBackupJob" },
        { AttributeKey: "EventName", AttributeValue: "RestoreBackupJob" },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;
    if (!events) return [];
  } catch (error) {
    console.error("Error retrieving CloudTrail logs:", error);
  }
}

// Certificate management logs: Logs showing encryption certificates being issued or renewed.

/**
 * Retrieves CloudTrail logs related to certificate management events.
 */
async function getCertificateManagementLogs() {
  try {
    // Look up CloudTrail events for certificate issuance, renewal, or deletion
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "RequestCertificate",
        },
        { AttributeKey: "EventName", AttributeValue: "RenewCertificate" },
        {
          AttributeKey: "EventName",
          AttributeValue: "DeleteCertificate",
        },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;
    if (!events) return [];
  } catch (error) {
    console.error(
      "Error retrieving CloudTrail logs for certificate management:",
      error
    );
  }
}
