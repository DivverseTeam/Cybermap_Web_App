import {
  DescribeKeyCommand,
  GetKeyPolicyCommand,
  GetKeyRotationStatusCommand,
  ListKeysCommand,
} from "@aws-sdk/client-kms";
import { kmsClient } from "./init";

// Encryption policies

async function getKeyDetails() {
  try {
    // List all key IDs
    const listKeysCommand = new ListKeysCommand({});
    const { Keys } = await kmsClient.send(listKeysCommand);
    if (!Keys) return [];

    const keyDetails = await Promise.all(
      Keys.map(async ({ KeyId }: any) => {
        // Describe the key to get general information
        const describeKeyCommand = new DescribeKeyCommand({ KeyId });
        const { KeyMetadata } = await kmsClient.send(describeKeyCommand);

        // Get the key policy
        const getKeyPolicyCommand = new GetKeyPolicyCommand({
          KeyId,
          PolicyName: "default",
        });
        const { Policy } = await kmsClient.send(getKeyPolicyCommand);

        // Check if key rotation is enabled
        let rotationEnabled;
        try {
          const getKeyRotationStatusCommand = new GetKeyRotationStatusCommand({
            KeyId,
          });
          const { KeyRotationEnabled } = await kmsClient.send(
            getKeyRotationStatusCommand
          );
          rotationEnabled = KeyRotationEnabled;
        } catch (error) {
          rotationEnabled = "Not Applicable";
        }

        return {
          KeyId: KeyMetadata?.KeyId,
          KeyArn: KeyMetadata?.Arn,
          KeyState: KeyMetadata?.KeyState,
          CreationDate: KeyMetadata?.CreationDate,
          Description: KeyMetadata?.Description,
          KeyUsage: KeyMetadata?.KeyUsage,
          Origin: KeyMetadata?.Origin,
          Policy,
          RotationEnabled: rotationEnabled,
        };
      })
    );

    return keyDetails;
  } catch (error) {
    console.error("Error retrieving key details:", error);
    throw error;
  }
}

// Key rotation schedules

async function getKeyRotationStatus() {
  try {
    // List all keys
    const listKeysCommand = new ListKeysCommand({});
    const { Keys } = await kmsClient.send(listKeysCommand);
    if (!Keys) return [];

    const keyRotationDetails = await Promise.all(
      Keys.map(async ({ KeyId }: any) => {
        // Get key metadata
        const describeKeyCommand = new DescribeKeyCommand({ KeyId });
        const { KeyMetadata } = await kmsClient.send(describeKeyCommand);

        // Check if key rotation is enabled (only applies to customer-managed keys)
        let rotationEnabled = false;
        if (KeyMetadata) {
          if (KeyMetadata.KeyManager === "CUSTOMER") {
            const getKeyRotationStatusCommand = new GetKeyRotationStatusCommand(
              {
                KeyId,
              }
            );
            const { KeyRotationEnabled } = await kmsClient.send(
              getKeyRotationStatusCommand
            );
            rotationEnabled = KeyRotationEnabled ?? false;
          }

          return {
            KeyId: KeyMetadata.KeyId,
            KeyArn: KeyMetadata.Arn,
            Description: KeyMetadata.Description,
            KeyManager: KeyMetadata.KeyManager,
            RotationEnabled: rotationEnabled,
            RotationFrequency: rotationEnabled ? "365 days" : "Not Applicable",
          };
        } else {
          return {
            KeyId,
            KeyArn: "Not Applicable",
            Description: "Not Applicable",
            KeyManager: "Not Applicable",
            RotationEnabled: "Not Applicable",
            RotationFrequency: "Not Applicable",
          };
        }
      })
    );

    return keyRotationDetails;
  } catch (error) {
    console.error("Error retrieving key rotation status:", error);
    throw error;
  }
}

// getKeyDetails()
//   .then((keyDetails) => console.log(JSON.stringify(keyDetails, null, 2)))
//   .catch((error) => console.error("Error:", error));
