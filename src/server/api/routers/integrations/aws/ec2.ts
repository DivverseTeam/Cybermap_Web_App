import { ec2Client } from "./init";
import { DescribeSnapshotsCommand } from "@aws-sdk/client-ec2";
import fs from "fs";

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
async function listEC2Snapshots() {
  try {
    const params = {
      OwnerIds: ["self"],
      NextToken: undefined,
    };

    let snapshots: any[] = [];
    let data;
    do {
      const describeSnapshotsCommand = new DescribeSnapshotsCommand(params);
      data = await ec2Client.send(describeSnapshotsCommand);

      // Add snapshots to the list
      snapshots = snapshots.concat(
        data.Snapshots.map(
          (snapshot: {
            SnapshotId: any;
            VolumeId: any;
            StartTime: any;
            State: any;
            Progress: any;
            Description: any;
          }) => ({
            SnapshotId: snapshot.SnapshotId,
            VolumeId: snapshot.VolumeId,
            StartTime: snapshot.StartTime,
            State: snapshot.State,
            Progress: snapshot.Progress,
            Description: snapshot.Description,
          })
        )
      );

      // Update NextToken for pagination
      params.NextToken = data.NextToken;
    } while (params.NextToken);

    console.log("EBS Snapshots:", snapshots);
    return snapshots;
  } catch (error) {
    console.error("Error retrieving EBS snapshots:", error);
  }
}

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
// test disaster recovery by attempting a snapshot recovery
async function testDisasterRecovery(snapshotId: any) {
  try {
    // Start recovery from snapshot by creating a volume (simulated recovery test)
    const volume = await ec2Client
      .createVolume({
        SnapshotId: snapshotId,
        AvailabilityZone: "your-availability-zone", // Replace with the correct AZ
      })
      .promise();

    // Log successful recovery attempt
    const logEntry = {
      timestamp: new Date().toISOString(),
      snapshotId,
      recoveryStatus: "SUCCESS",
      volumeId: volume.VolumeId,
      message: "Volume successfully created from snapshot for recovery test.",
    };
    logResult(logEntry);
    return logEntry;
  } catch (error: any) {
    // Log failed recovery attempt
    const logEntry = {
      timestamp: new Date().toISOString(),
      snapshotId,
      recoveryStatus: "FAILED",
      message: `Failed to recover from snapshot: ${error.message}`,
    };
    logResult(logEntry);
    throw error;
  }
}

// log test results to a JSON file

function logResult(logEntry: {
  timestamp: string;
  snapshotId: any;
  recoveryStatus: string;
  volumeId?: any;
  message: string;
}) {
  const logFile = "dr_test_results.json";
  let logData: any[] = [];

  // Read existing log data if available
  if (fs.existsSync(logFile)) {
    const existingData: any = fs.readFileSync(logFile);
    logData = JSON.parse(existingData) as any[];
  }

  // Append the new log entry
  logData.push(logEntry);

  // Write updated log data to the file
  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
  console.log("Log entry added:", logEntry);
}

// // Run a test
// const snapshotId = 'your-snapshot-id'; // Replace with an actual Snapshot ID to test
// testDisasterRecovery(snapshotId)
//   .then((result) => {
//     console.log("Disaster recovery test completed:", result);
//   })
//   .catch((error) => {
//     console.error("Error during disaster recovery test:", error);
//   });

// Regularly list EC2 snapshots to ensure that backup processes are functioning and timely.
/**
 * Retrieves and lists all EC2 snapshots in the account with their creation timestamps.
 * Filters can be added to look for specific tags or snapshot dates.
 */
async function checkEC2RegularBackup() {
  try {
    // Retrieve snapshots created by your account
    const describeSnapshotsCommand = new DescribeSnapshotsCommand({
      OwnerIds: ["self"], // Only get snapshots owned by this account
    });
    const snapshots = await ec2Client.send(describeSnapshotsCommand);

    // Sort snapshots by StartTime (creation date) in descending order
    const sortedSnapshots = snapshots.Snapshots.sort(
      (a: any, b: any) => new Date(b.StartTime) - new Date(a.StartTime)
    );

    console.log("EC2 Snapshots:", JSON.stringify(sortedSnapshots, null, 2));

    // Optional: Check if recent snapshots exist (e.g., within the last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
    const recentSnapshots = sortedSnapshots.filter(
      (snapshot: { StartTime: string | number | Date }) =>
        new Date(snapshot.StartTime) > oneDayAgo
    );

    if (recentSnapshots.length > 0) {
      console.log(
        "Recent Snapshots (last 24 hours):",
        JSON.stringify(recentSnapshots, null, 2)
      );
    } else {
      console.log("No snapshots created in the last 24 hours.");
    }
  } catch (error) {
    console.error("Error retrieving EC2 snapshots:", error);
  }
}
