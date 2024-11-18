import {
  LookupAttribute,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { cloudTrailClient, kmsClient, s3Client } from "../init";
import { ListKeysCommand } from "@aws-sdk/client-kms";

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

async function getAllS3Buckets() {
  const listBucketsCommand = new ListBucketsCommand({});
  const buckets = await s3Client.send(listBucketsCommand);
  return buckets?.Buckets || [];
}

async function getAllEncryptionKeys() {
  const listCommand = new ListKeysCommand({});
  const listResponse = await kmsClient.send(listCommand);
  return listResponse?.Keys || [];
}

export { getCloudTrailEvents, getAllS3Buckets, getAllEncryptionKeys };