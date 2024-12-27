//@ts-nocheck
import { KeyVaultManagementClient } from "@azure/arm-keyvault";
import { ResourceGraphClient } from "@azure/arm-resourcegraph";
import { KeyClient, KeyProperties } from "@azure/keyvault-keys";
// import { Client } from "@microsoft/microsoft-graph-client";
import { Resource } from "@azure/arm-resources";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { StaticTokenCredential } from "../../common/azureTokenCredential";
import { getCredentials } from "../init";

async function getAssetInventoryLogs({
  subscriptionId,
  resourceGraphClient,
  controlId,
  controlName,
  organisationId,
}: {
  organisationId: string;
  controlId: string;
  controlName: string;
  subscriptionId: string;
  resourceGraphClient: ResourceGraphClient;
}) {
  try {
    const evd_name = `Asset inventory logs`;
    // Sample query to list all resources with tags
    const queryOptions = {
      subscriptions: [subscriptionId], // Replace with your Azure subscription ID(s)
      query: "Resources | where isnotempty(tags) | project name, type, tags",
    };

    // Execute the query
    const response = await resourceGraphClient.resources(queryOptions);
    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence: response },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

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

async function getEncryptionLogs({
  controlId,
  controlName,
  organisationId,
  credential,
  keyVaultManagementClient,
}: {
  organisationId: string;
  controlId: string;
  controlName: string;
  credential: StaticTokenCredential;
  keyVaultManagementClient: KeyVaultManagementClient;
}) {
  try {
    const evd_name = `Encryption logs`;
    // List all Key Vaults in the subscription
    const evidence = {};
    const keyVaultsIterator = await keyVaultManagementClient.vaults.list();
    const keyVaults = await asyncIteratorToArray(keyVaultsIterator);

    let fullyImplemented = 0;
    let partiallyImplemented = 0;
    let notImplemented = 0;

    for (const vault of keyVaults) {
      const keyVaultUrl = `https://${vault.name}.vault.azure.net`;
      evidence[vault.name] = {};
      const keyClient = new KeyClient(keyVaultUrl, credential);

      let listKeysImplemented = false;
      let describeKeyImplemented = false;

      const valutKeysIterator = await keyClient.listPropertiesOfKeys();
      const valutKeys: KeyProperties[] = await asyncIteratorToArray(
        valutKeysIterator
      );
      listKeysImplemented = valutKeys.length > 0;

      // Check for describe key functionality (equivalent to AWS KMS DescribeKey)
      if (listKeysImplemented && valutKeys && valutKeys.length) {
        const testKey = await keyClient.getKey(valutKeys[0].name);
        evidence[vault.name][valutKeys[0].name] = testKey;
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
    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });
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

async function getRequirementFourStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const keyVaultManagementClient = new KeyVaultManagementClient(
    credential,
    subscriptionId
  );
  const resourceGraphClient = new ResourceGraphClient(credential);
  // PENDING - Asset inventory logs
  return evaluate(
    [
      () =>
        getEncryptionLogs({
          credential,
          controlName,
          controlId,
          organisationId,
          keyVaultManagementClient,
        }),
      () =>
        getAssetInventoryLogs({
          subscriptionId,
          controlName,
          controlId,
          organisationId,
          resourceGraphClient,
        }),
    ],
    [azureCloud.integrationId]
  );
}

export { getRequirementFourStatus };
