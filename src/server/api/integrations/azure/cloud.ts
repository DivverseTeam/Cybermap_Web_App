import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { DefaultAzureCredential } from "@azure/identity";
import { CertificateClient } from "@azure/keyvault-certificates";
import { LogsQueryClient, QueryTimeInterval } from "@azure/monitor-query";

const credential = new DefaultAzureCredential();

// Types for logs in Azure Monitor (can be extended)
type AzureLogColumns =
  | "TimeGenerated"
  | "OperationName"
  | "ResourceId"
  | "ResultDescription"
  | "Identity";

type SecurityAlertColumns =
  | "TimeGenerated"
  | "AlertName"
  | "Severity"
  | "CompromisedEntity"
  | "Description"
  | "VendorInformation"
  | "AlertType"
  | "Status";

export class QueryBuilder<T extends string> {
  private columns: T[] = [];
  private filters: string[] = [];
  private sortColumn?: T;
  private sortOrder: "asc" | "desc" = "desc";

  // Add columns to project in the query
  project(...columns: T[]): this {
    this.columns.push(...columns);
    return this;
  }

  // Add filters to the query
  where(condition: string): this {
    this.filters.push(condition);
    return this;
  }

  // Set sorting options
  orderBy(column: T, order: "asc" | "desc" = "desc"): this {
    this.sortColumn = column;
    this.sortOrder = order;
    return this;
  }

  // Build the final query string
  build(tableName: string): string {
    const projectClause =
      this.columns.length > 0 ? `| project ${this.columns.join(", ")}` : "";
    const whereClause =
      this.filters.length > 0 ? `| where ${this.filters.join(" and ")}` : "";
    const orderClause = this.sortColumn
      ? `| order by ${this.sortColumn} ${this.sortOrder}`
      : "";

    return `${tableName} ${whereClause} ${projectClause} ${orderClause}`;
  }
}

export const triggerPolicyComplianceScan = async (subscriptionId: string) => {
  const client = new PolicyInsightsClient(credential, subscriptionId);

  await client.policyStates.beginTriggerSubscriptionEvaluationAndWait(
    subscriptionId,
  );

  console.log(`Compliance scan triggered `);
};

export const summarizePolicyCompliance = async (subscriptionId: string) => {
  const credential = new DefaultAzureCredential();
  const client = new PolicyInsightsClient(credential, subscriptionId);

  const summary =
    await client.policyStates.summarizeForSubscription(subscriptionId);

  return summary;
};

export const listKeyVaultCertificates = async (vaultName: string) => {
  const keyVaultUrl = `https://${vaultName}.vault.azure.net`;
  const client = new CertificateClient(keyVaultUrl, credential);

  console.log("Listing SSL certificates from Key Vault...");

  const certificateProperties = await client.listPropertiesOfCertificates();
  return certificateProperties;
  // for await (const certificate of client.listPropertiesOfCertificates()) {
  // 	certificates.push({
  // 		name: certificate.name,
  // 		enabled: certificate.enabled,
  // 		createdOn: certificate.createdOn,
  // 		expiresOn: certificate.expiresOn,
  // 	});
  // }

  // console.log("Certificates from Key Vault:", certificates);
};

export const getKeyCreationLogs = async (workspaceId: string) => {
  const logsClient = new LogsQueryClient(credential);

  const queryBuilder = new QueryBuilder<AzureLogColumns>()
    .project(
      "TimeGenerated",
      "OperationName",
      "ResourceId",
      "ResultDescription",
      "Identity",
    )
    .where("OperationName == 'Create Key'")
    .where("ResultDescription == 'Success'")
    .orderBy("TimeGenerated", "desc");

  const query = queryBuilder.build("AzureDiagnostics");

  const result = await logsClient.queryWorkspace(workspaceId, query, {
    endTime: new Date(),
    duration: "7D",
  });

  return result;
};

export const getMalwareScanLogs = async (workspaceId: string) => {
  const logsClient = new LogsQueryClient(credential);

  const queryBuilder = new QueryBuilder<SecurityAlertColumns>()
    .project(
      "TimeGenerated",
      "AlertName",
      "Severity",
      "CompromisedEntity",
      "Description",
      "VendorInformation",
      "AlertType",
      "Status",
    )
    .where("ProductName == 'Azure Defender'")
    .where("AlertName contains 'Malware' or AlertType contains 'Malware'")
    .orderBy("TimeGenerated", "desc");

  const query = queryBuilder.build("SecurityAlert");

  const result = await logsClient.queryWorkspace(workspaceId, query, {
    endTime: new Date(),
    duration: "7D",
  });

  return result;
};
