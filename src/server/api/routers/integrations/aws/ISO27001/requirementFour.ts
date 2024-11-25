import { DescribeKeyCommand, ListKeysCommand } from "@aws-sdk/client-kms";
import { GetResourcesCommand } from "@aws-sdk/client-resource-groups-tagging-api";
import { kmsClient, taggingClient } from "../init";

/**
 * Asset Inventory Logs: Retrieves a list of all tagged AWS resources to maintain an inventory.
 */
const getAssetInventoryLogs = async () => {
  try {
    const command = new GetResourcesCommand({});
    const response = await taggingClient.send(command);
    return response.ResourceTagMappingList;
  } catch (error) {
    console.error("Error fetching asset inventory logs:", error);
  }
};

/**
 * Encryption Logs: Retrieves a list of KMS keys used to demonstrate data encryption.
 * @returns {Promise<Object[]>} List of encryption key details.
 */
const getEncryptionLogs = async () => {
  try {
    const command = new ListKeysCommand({});
    const { Keys } = await kmsClient.send(command);

    if (!Keys || !Keys.length) {
      return [];
    }

    // Retrieve details for each key
    const keyDetailsPromises = Keys.map(async (key) => {
      const describeCommand = new DescribeKeyCommand({ KeyId: key.KeyId });
      const keyDetails = await kmsClient.send(describeCommand);
      return keyDetails.KeyMetadata;
    });

    const keyDetailsList = await Promise.all(keyDetailsPromises);
    return keyDetailsList;
  } catch (error) {
    console.error("Error fetching encryption logs:", error);
  }
};

// // Example usage
// (async () => {
//   const assetInventory = await getAssetInventoryLogs();
//   console.log("Asset Inventory Logs:", assetInventory);

//   const encryptionLogs = await getEncryptionLogs();
//   console.log("Encryption Logs:", encryptionLogs);
// })();
