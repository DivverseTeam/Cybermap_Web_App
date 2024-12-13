//@ts-nocheck
import { KeyVaultManagementClient } from "@azure/arm-keyvault";
// import { StorageManagementClient } from "@azure/arm-storage";
import { KeyClient, KeyProperties } from "@azure/keyvault-keys";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { StaticTokenCredential } from "../../common/azureTokenCredential";
import { getCredentials } from "../init";

async function getEncryptionLogs(
  credential: StaticTokenCredential,
  keyVaultManagementClient: KeyVaultManagementClient
) {
  try {
    // List all Key Vaults in the subscription
    const keyVaults = [];
    for await (const vault of keyVaultManagementClient.vaults.list()) {
      keyVaults.push(vault);
    }

    let fullyImplemented = 0;
    let partiallyImplemented = 0;
    let notImplemented = 0;

    for (const vault of keyVaults) {
      const keyVaultUrl = `https://${vault.name}.vault.azure.net`;
      const keyClient = new KeyClient(keyVaultUrl, credential);

      let listKeysImplemented = false;
      let describeKeyImplemented = false;

      const valutKeys: KeyProperties[] = [];

      for await (const key of keyClient.listPropertiesOfKeys()) {
        valutKeys.push(key);
      }
      listKeysImplemented = valutKeys.length > 0;

      // Check for describe key functionality (equivalent to AWS KMS DescribeKey)
      if (listKeysImplemented && valutKeys && valutKeys.length) {
        const testKey = await keyClient.getKey(valutKeys[0].name);
        describeKeyImplemented = !!testKey;
      }

      // Determine the status based on implemented features
      if (listKeysImplemented && describeKeyImplemented) {
        fullyImplemented++;
      } else if (listKeysImplemented || describeKeyImplemented) {
        partiallyImplemented++;
      } else {
        notImplemented++;
      }
    }
    if (
      fullyImplemented > 0 &&
      notImplemented === 0 &&
      partiallyImplemented === 0
    ) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (
      notImplemented > 0 &&
      fullyImplemented === 0 &&
      partiallyImplemented === 0
    ) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    return null;
  }
}

// async function getKeyManagementLogs(
//   storageManagementClient: StorageManagementClient
// ) {
//   try {
//     // List all storage accounts in the subscription
//     const storageAccounts =
//       await storageManagementClient.storageAccounts.list();
//     let hasNotImplemented = false;
//     let hasPartiallyImplemented = false;
//     let hasFullyImplemented = false;

//     for (const account of storageAccounts) {
//       const resourceGroupName = account.id.split("/")[4];
//       const accountName = account.name;

//       try {
//         // Get the properties of the Blob service
//         const blobServiceProperties =
//           await storageManagementClient.blobServices.getServiceProperties(
//             resourceGroupName,
//             accountName,
//             "default"
//           );

//         // Check encryption settings
//         const encryption = blobServiceProperties.encryption;

//         if (
//           !encryption ||
//           !encryption.services ||
//           !encryption.services.blob ||
//           !encryption.services.blob.enabled
//         ) {
//           hasNotImplemented = true;
//           continue;
//         }

//         if (
//           encryption.services.blob.enabled &&
//           encryption.keySource === "Microsoft.Storage"
//         ) {
//           hasFullyImplemented = true;
//         } else {
//           hasPartiallyImplemented = true;
//         }
//       } catch (error: any) {
//         console.error(
//           `Error retrieving encryption status for ${accountName}:`,
//           error.message
//         );
//         hasNotImplemented = true; // Treat errors as "Not Implemented"
//       }
//     }

//     if (hasNotImplemented) {
//       return "Not Implemented";
//     } else if (hasPartiallyImplemented) {
//       return "Partially Implemented";
//     } else if (hasFullyImplemented) {
//       return "Fully Implemented";
//     }
//   } catch (error) {
//     return null;
//   }
// }

async function getRequirementFourStatus({ azureCloud }: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const keyVaultManagementClient = new KeyVaultManagementClient(
    credential,
    subscriptionId
  );
  //   const storageManagementClient = new StorageManagementClient(
  //     credential,
  //     subscriptionId
  //   );

  // PENDING - AKey management logs
  return evaluate([
    () => getEncryptionLogs(credential, keyVaultManagementClient),
    // () => getKeyManagementLogs(storageManagementClient),
  ]);
}

export { getRequirementFourStatus };
