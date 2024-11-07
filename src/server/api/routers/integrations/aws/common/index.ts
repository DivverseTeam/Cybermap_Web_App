import { LookupAttribute, LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { cloudTrailClient } from "../init";


export async function getCloudTrailEvents({
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
