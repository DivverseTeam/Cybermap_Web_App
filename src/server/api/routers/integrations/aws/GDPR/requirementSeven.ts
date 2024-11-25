// Import necessary AWS SDK clients
import {
  CloudTrailClient,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { S3Client, GetBucketReplicationCommand } from "@aws-sdk/client-s3";
import { cloudTrailClient, s3Client } from "../init";

/**
 * Evidence: Data transfer logs
 * Function to retrieve CloudTrail logs of data transfers outside the EEA.
 * This uses the LookupEvents API to track data movement and verify compliance.
 */
const getDataTransferLogs = async (
  startTime: Date,
  endTime: Date,
  region: string
) => {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
      LookupAttributes: [
        {
          AttributeKey: "EventSource",
          AttributeValue: "s3.amazonaws.com",
        },
        // {
        //   AttributeKey: "AWSRegion",
        //   AttributeValue: region, // Filter for data transfers outside the EEA
        // },
      ],
    });

    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error retrieving data transfer logs:", error);
    throw error;
  }
};

/**
 * Evidence: Legal documentation
 * Function to retrieve S3 cross-region replication details.
 * This uses the GetBucketReplication API to verify the compliance of cross-region replication configurations.
 */
const getBucketReplicationDetails = async (bucketName: string) => {
  try {
    const command = new GetBucketReplicationCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    return response.ReplicationConfiguration;
  } catch (error) {
    console.error("Error retrieving bucket replication details:", error);
    throw error;
  }
};

// // Example usage
// (async () => {
//   try {
//     // Replace with your values
//     const startTime = new Date("2023-01-01T00:00:00Z");
//     const endTime = new Date("2023-12-31T23:59:59Z");
//     const region = "eu-west-1"; // Example region outside the EEA
//     const bucketName = "your-bucket-name";

//     // Get data transfer logs
//     const transferLogs = await getDataTransferLogs(startTime, endTime, region);
//     console.log("Data Transfer Logs:", transferLogs);

//     // Get bucket replication details
//     const replicationDetails = await getBucketReplicationDetails(bucketName);
//     console.log("Bucket Replication Details:", replicationDetails);
//   } catch (error) {
//     console.error("Error executing evidence gathering functions:", error);
//   }
// })();
