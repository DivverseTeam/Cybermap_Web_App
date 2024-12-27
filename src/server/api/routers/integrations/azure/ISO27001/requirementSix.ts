import { KeyVaultManagementClient, Vault } from "@azure/arm-keyvault";
// import { StorageManagementClient } from "@azure/arm-storage";
import { ResourceGroup, ResourceManagementClient } from "@azure/arm-resources";
import { KeyClient, KeyProperties } from "@azure/keyvault-keys";
import { SecretClient, SecretProperties } from "@azure/keyvault-secrets";
import { ControlStatus } from "~/lib/types/controls";
import {
  AzureAUth,
  evaluate,
  getStatusByCount,
  saveEvidence,
} from "../../common";
import { StaticTokenCredential } from "../../common/azureTokenCredential";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getEncryptionLogs({
  controlName,
  controlId,
  organisationId,
  credential,
  keyVaultManagementClient,
}: {
  controlName: string;
  organisationId: string;
  controlId: string;
  credential: StaticTokenCredential;
  keyVaultManagementClient: KeyVaultManagementClient;
}) {
  try {
    // List all Key Vaults in the subscription
    const evd_name = `Encryption logs`;
    const evidence: any = {};

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
        if (!valutKeys[0]) continue;
        if (!valutKeys[0].name) continue;
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
    return getStatusByCount({
      fullyImplemented,
      notImplemented,
      partiallyImplemented,
    });
  } catch (error) {
    return null;
  }
}

async function getKeyManagementLogs({
  controlName,
  controlId,
  organisationId,
  credential,
  keyVaultManagementClient,
  resourceClient,
}: {
  controlName: string;
  organisationId: string;
  controlId: string;
  credential: StaticTokenCredential;
  resourceClient: ResourceManagementClient;
  keyVaultManagementClient: KeyVaultManagementClient;
}) {
  try {
    const evd_name = `Key management logs`;
    const evidence: any = [];
    // Get all resource groups
    const resourceGroupsIterator = await resourceClient.resourceGroups.list();
    const resourceGroups: ResourceGroup[] = await asyncIteratorToArray(
      resourceGroupsIterator
    );

    let rotationImplemented = false;
    let keyUsageDetected = false;

    for (const group of resourceGroups) {
      // List Key Vaults in each resource group
      if (!group.name) continue;
      const keyVaultsIterator =
        await keyVaultManagementClient.vaults.listByResourceGroup(group.name);
      const keyVaults: Vault[] = await asyncIteratorToArray(keyVaultsIterator);

      for (const vault of keyVaults) {
        if (!vault.properties || !vault.properties.vaultUri) continue;
        const keyVaultUrl = vault.properties.vaultUri;
        const keyClient = new KeyClient(keyVaultUrl, credential);
        const secretClient = new SecretClient(keyVaultUrl, credential);

        // Check for key rotation policy
        const keysIterator = await keyClient.listPropertiesOfKeys();
        const keys: KeyProperties[] = await asyncIteratorToArray(keysIterator);
        for (const keyProperties of keys) {
          const rotationPolicy = await keyClient.getKeyRotationPolicy(
            keyProperties.name
          );
          if (rotationPolicy) {
            rotationImplemented = true;
          }
        }

        // Check for key usage
        const secretsIterator = await secretClient.listPropertiesOfSecrets();
        const secrets: SecretProperties[] = await asyncIteratorToArray(
          secretsIterator
        );
        for (const secretProperties of secrets) {
          if (!secretProperties.name) continue;
          if (!vault.name) continue;
          const secret = await secretClient.getSecret(secretProperties.name);
          if (!secret.value) continue;
          if (secret.value.includes(vault.name)) {
            keyUsageDetected = true;
          }
        }
      }
    }

    // Determine enforcement status
    const implemented = rotationImplemented && keyUsageDetected;
    const partiallyImplemented = rotationImplemented || keyUsageDetected;

    if (implemented) return ControlStatus.Enum.FULLY_IMPLEMENTED;
    if (partiallyImplemented) return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  } catch (error) {
    throw error;
  }
}

async function getRequirementSixStatus({
  azureCloud,
  controlId,
  organisationId,
  controlName,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const keyVaultManagementClient = new KeyVaultManagementClient(
    credential,
    subscriptionId
  );
  const resourceClient = new ResourceManagementClient(
    credential,
    subscriptionId
  );

  return evaluate(
    [
      () =>
        getEncryptionLogs({
          credential,
          controlId,
          controlName,
          organisationId,
          keyVaultManagementClient,
        }),
      () =>
        getKeyManagementLogs({
          credential,
          controlId,
          controlName,
          organisationId,
          keyVaultManagementClient,
          resourceClient,
        }),
    ],
    [azureCloud.integrationId]
  );
}

export { getRequirementSixStatus };
