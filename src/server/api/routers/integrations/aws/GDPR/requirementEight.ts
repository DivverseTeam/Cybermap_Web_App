// Import necessary AWS SDK clients
import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import {
  ListDiscoveredResourcesCommand,
  ResourceType,
} from "@aws-sdk/client-config-service";
import { cloudTrailClient, configServiceClient } from "../init";

/**
 * Evidence: Processing activity logs
 *
 * Uses AWS CloudTrail to track all data processing activities, providing evidence for record-keeping purposes.
 * This function retrieves events that could indicate personal data processing activities.
 *
 * @param {string} startTime - The start time for event lookup in ISO string format.
 * @param {string} endTime - The end time for event lookup in ISO string format.
 * @param {string} lookupAttributeKey - The key to look up, e.g., 'EventName' or 'Username'.
 * @param {string} lookupAttributeValue - The value associated with the lookup key.
 * @returns {Promise} - Promise resolving with the list of CloudTrail events.
 */
const getProcessingActivityLogs = async (
  startTime: Date,
  endTime: Date,
  lookupAttributeKey: string,
  lookupAttributeValue: string
) => {
  const command = new LookupEventsCommand({
    StartTime: new Date(startTime),
    EndTime: new Date(endTime),
    // LookupAttributes: [
    //   {
    //     AttributeKey: lookupAttributeKey,
    //     AttributeValue: lookupAttributeValue,
    //   },
    // ],
  });

  try {
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error retrieving processing activity logs:", error);
    throw error;
  }
};

/**
 * Evidence: Record of processing activities
 *
 * Uses AWS Config to list all resources that handle personal data, helping to maintain a record of processing activities.
 * This function retrieves a list of discovered resources relevant to data processing.
 *
 * @param {string} resourceType - The type of resource to list, e.g., 'AWS::EC2::Instance'.
 * @returns {Promise} - Promise resolving with the list of discovered resources.
 */
const getDataProcessingResources = async (resourceType: ResourceType) => {
  const command = new ListDiscoveredResourcesCommand({
    resourceType,
  });

  try {
    const response = await configServiceClient.send(command);
    return response.resourceIdentifiers;
  } catch (error) {
    console.error("Error retrieving data processing resources:", error);
    throw error;
  }
};
