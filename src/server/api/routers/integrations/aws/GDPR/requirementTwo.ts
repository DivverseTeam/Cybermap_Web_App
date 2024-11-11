import {
  CloudTrailClient,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { cloudTrailClient } from "../init";

// const dynamoDBClient = new DynamoDBClient({ region: "your-region" });

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
      StartTime: new Date("YYYY-MM-DD"),
      EndTime: new Date(),
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
      StartTime: new Date("YYYY-MM-DD"),
      EndTime: new Date(),
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error fetching data processing documentation:", error);
  }
}

/**
 * Evidence: Consent management logs (DynamoDB)
 * This function scans a DynamoDB table to retrieve records of consent.
 * It verifies when and how consent for data processing was obtained.
 */
// async function getConsentRecordsFromDynamoDB() {
//   try {
//     const command = new ScanCommand({
//       TableName: "ConsentRecordsTable", // Replace with your DynamoDB table name
//       FilterExpression: "attribute_exists(consentGiven)", // Customize based on table schema
//     });
//     const response = await dynamoDBClient.send(command);
//     return response.Items;
//   } catch (error) {
//     console.error("Error fetching consent records from DynamoDB:", error);
//   }
// }
