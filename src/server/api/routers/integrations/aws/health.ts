import { DescribeEventsCommand } from "@aws-sdk/client-health";
import { healthClient } from "./init";

// Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.

/**
 * Retrieves AWS Health events for service downtime or major security incidents.
 */
async function getHealthEvents() {
  try {
    const describeEventsCommand = new DescribeEventsCommand({});
    const describeEventsResponse = await healthClient.send(
      describeEventsCommand
    );
    console.log(
      "AWS Health Events:",
      JSON.stringify(describeEventsResponse.events, null, 2)
    );
  } catch (error) {
    console.error("Error retrieving AWS Health events:", error);
  }
}
