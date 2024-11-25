//  Lawful Basis for Processing (Article 6)

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { cloudTrailClient } from "../init";
import { TIME_FRAME } from "../constants";

/**
 * Evidence: Consent management logs
 * This function retrieves CloudTrail events related to user consent, showing proof of when consent was captured.
 * It filters events based on actions related to consent.
 */
async function getConsentManagementLogs() {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        { AttributeKey: "EventName", AttributeValue: "ConsentGiven" },
      ],
      StartTime: TIME_FRAME.START,
      EndTime: TIME_FRAME.END,
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error fetching consent management logs:", error);
  }
}

/**
 * Evidence: Data processing documentation
 * This function retrieves CloudTrail events showing data processing activities.
 * It demonstrates compliance by tracking when personal data was accessed, updated, or deleted.
 */
async function getDataProcessingDocumentation() {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        { AttributeKey: "EventName", AttributeValue: "DataAccessed" },
        { AttributeKey: "EventName", AttributeValue: "DataUpdated" },
        { AttributeKey: "EventName", AttributeValue: "DataDeleted" },
      ],
      StartTime: TIME_FRAME.START,
      EndTime: TIME_FRAME.END,
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error fetching data processing documentation:", error);
  }
}

async function getLawfulBasisForDataProcessingEvidence() {
  const consentManagementLogs = await getConsentManagementLogs();
  const dataProcessingDocumentation = await getDataProcessingDocumentation();
  return { consentManagementLogs, dataProcessingDocumentation };
}

export { getLawfulBasisForDataProcessingEvidence };