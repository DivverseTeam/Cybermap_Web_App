//@ts-nocheck
import { KeyClient, KeyProperties } from "@azure/keyvault-keys";
import { KeyVaultManagementClient } from "@azure/arm-keyvault";
import { ResourceGraphClient } from "@azure/arm-resourcegraph";
// import { Client } from "@microsoft/microsoft-graph-client";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { getCredentials } from "../init";
import { Resource } from "@azure/arm-resources";
import { StaticTokenCredential } from "../../common/azureTokenCredential";

async function getAssetInventoryLogs(
  subscriptionId: string,
  resourceGraphClient: ResourceGraphClient
) {
  try {
    // Sample query to list all resources with tags
    const queryOptions = {
      subscriptions: [subscriptionId], // Replace with your Azure subscription ID(s)
      query: "Resources | where isnotempty(tags) | project name, type, tags",
    };

    // Execute the query
    const response = await resourceGraphClient.resources(queryOptions);

    // Check if resources with tags are retrieved
    if (response.totalRecords > 0) {
      // Validate if Azure functionality fully matches AWS's GetResources behavior
      const allResourcesTagged = response.data.every(
        (resource: Resource) =>
          resource.tags && Object.keys(resource.tags).length > 0
      );

      if (allResourcesTagged) {
        return ControlStatus.Enum.FULLY_IMPLEMENTED;
      } else {
        return ControlStatus.Enum.PARTIALLY_IMPLEMENTED; // Some resources are tagged, but not all
      }
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }
  } catch (error) {
    return null;
  }
}

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

async function getRequirementFourStatus({ azureCloud }: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const keyVaultManagementClient = new KeyVaultManagementClient(
    credential,
    subscriptionId
  );
  const resourceGraphClient = new ResourceGraphClient(credential);
  // PENDING - Asset inventory logs
  return evaluate([
    () => getEncryptionLogs(credential, keyVaultManagementClient),
    () => getAssetInventoryLogs(subscriptionId, resourceGraphClient),
  ]);
}

export { getRequirementFourStatus };
