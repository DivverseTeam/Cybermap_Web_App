// Importing necessary AWS SDK client
import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { cloudTrailClient } from "../init";

/**
 * Evidence: AWS CloudTrail API - LookupEvents
 * This function retrieves events from CloudTrail logs, providing access records to virtual resources.
 * Example usage: Monitor access to virtual machines, storage, and other AWS resources containing sensitive data.
 */
const getAccessEvents = async (
  resourceName = "",
  startTime = "",
  endTime = ""
) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: resourceName
        ? [{ AttributeKey: "ResourceName", AttributeValue: resourceName }]
        : [],
      StartTime: startTime ? new Date(startTime) : undefined,
      EndTime: endTime ? new Date(endTime) : undefined,
      MaxResults: 50,
    });
    const response = await cloudTrailClient.send(command);

    return response.Events || [];
  } catch (error) {
    console.error("Error fetching access events:", error);
    throw error;
  }
};

/**
 * Evidence: AWS CloudTrail API - LookupEvents
 * This function retrieves events for all AWS resource accesses within a specified time range.
 * It can be used to monitor sensitive resource access across the AWS account.
 */
const getAllAccessEvents = async (startTime = "", endTime = "") => {
  try {
    const params = {
      StartTime: startTime ? new Date(startTime) : undefined,
      EndTime: endTime ? new Date(endTime) : undefined,
      MaxResults: 50,
    };

    const command = new LookupEventsCommand(params);
    const response = await cloudTrailClient.send(command);

    return response.Events || [];
  } catch (error) {
    console.error("Error fetching all access events:", error);
    throw error;
  }
};
