// Helper functions to get data from Google Cloud
import { PoliciesClient } from "@google-cloud/iam";
import { ProjectsClient, FoldersClient } from "@google-cloud/resource-manager";
import { OrgPolicyClient } from "@google-cloud/org-policy";
import { Logging } from "@google-cloud/logging";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { Storage } from "@google-cloud/storage";
import { InstancesClient } from "@google-cloud/compute";
import { CloudFilestoreManagerClient } from "@google-cloud/filestore";
import { MetricServiceClient } from "@google-cloud/monitoring";
import { SecurityCenterClient } from "@google-cloud/security-center";
import { BigQuery } from "@google-cloud/bigquery";

export const listPolicies = async (projectId: string) => {
	const policiesClient = new PoliciesClient();
	const policies = await policiesClient.listPolicies({
		parent: `projects/${projectId}`,
	});
	return policies;
};

export const listOrgPolicies = async (projectId: string) => {
	const orgPolicyClient = new OrgPolicyClient();
	const orgPolicies = await orgPolicyClient.listPolicies({
		parent: `projects/${projectId}`,
	});
	return orgPolicies;
};

export const getAuthenticationLogs = async (projectId: string) => {
	const logging = new Logging();

	const logFilter = `
        logName="projects/${projectId}/logs/cloudaudit.googleapis.com%2Factivity"
        AND protoPayload.methodName="google.accounts.login"
    `;

	const [entries] = await logging.getEntries({
		filter: logFilter,
		orderBy: "timestamp desc",
		pageSize: 10,
	});

	console.log("Sign-in Activity Logs:");
	entries.forEach((entry) => {
		const payload = entry.data?.protoPayload;
		console.log(`Timestamp: ${entry.metadata.timestamp}`);
		console.log(`User: ${payload?.authenticationInfo?.principalEmail}`);
		console.log(`Method: ${payload?.methodName}`);
		console.log("----");
	});

	return entries;
};

export const getAuditLogs = async (projectId: string) => {
	const logging = new Logging();

	const logFilter = `
        logName="projects/${projectId}/logs/cloudaudit.googleapis.com%2Factivity"
    `;

	const [entries] = await logging.getEntries({
		filter: logFilter,
		orderBy: "timestamp desc",
		pageSize: 10,
	});

	console.log("Audit Logs:");
	entries.forEach((entry) => {
		console.log(entry);
		// const payload = entry.metadata?.textPayload;
		// console.log(`Timestamp: ${entry.metadata.timestamp}`);
		// console.log(`Method: ${payload.methodName}`);
		// console.log(`Resource: ${payload.resourceName}`);
		// console.log("---");
	});

	return entries;
};

export const getKMSKeyDetails = async (keyName: string) => {
	const kmsClient = new KeyManagementServiceClient();
	const [key] = await kmsClient.getCryptoKey({ name: keyName });
	return key;
};

export const getAllKMSKeys = async (projectId: string) => {
	const kmsClient = new KeyManagementServiceClient();
	const [keys] = await kmsClient.listCryptoKeys({
		parent: `projects/${projectId}`,
	});

	return keys;
};

export const getBuckets = async () => {
	const storage = new Storage();
	const [buckets] = await storage.getBuckets();

	buckets.forEach((bucket) => {
		console.log(bucket.name);
	});

	return buckets;
};

export const getBucketMetadata = async (bucketName: string) => {
	const storage = new Storage();
	const bucket = storage.bucket(bucketName);
	const [metadata] = await bucket.getMetadata();

	return metadata;
};

export const getBucketLifecyclePolicy = async (bucketName: string) => {
	const storage = new Storage();
	const bucket = storage.bucket(bucketName);

	const [metadata] = await bucket.getMetadata();

	console.log(`Lifecycle rules for bucket ${bucketName}:`);
	if (metadata?.lifecycle?.rule) {
		metadata.lifecycle.rule.forEach((rule, index) => {
			console.log(`Rule ${index + 1}:`);
			console.log(`  Action: ${JSON.stringify(rule.action)}`);
			console.log(`  Condition: ${JSON.stringify(rule.condition)}`);
		});
	} else {
		console.log("No lifecycle rules found for this bucket.");
	}

	return metadata.lifecycle;
};

export const getComputeInstances = async () => {
	const instancesClient = new InstancesClient();

	const [instances] = await instancesClient.list();

	return instances;
};

export const getFileStoreBackups = async () => {
	const fileStoreClient = new CloudFilestoreManagerClient();

	const [backups] = await fileStoreClient.listBackups();

	console.log("Filestore Backups:");
	backups.forEach((backup) => {
		console.log(`Name: ${backup.name}`);
		console.log(`Description: ${backup.description}`);
		console.log(`State: ${backup.state}`);
		console.log(`Create Time: ${backup.createTime}`);
		console.log("---");
	});

	return backups;
};

export const getMonitoringData = async (
	projectId: string,
	filter: string,
	interval: { startTime: Date; endTime: Date },
) => {
	const client = new MetricServiceClient();

	const request = {
		name: client.projectPath(projectId),
		filter: filter,
		interval: {
			startTime: {
				seconds: interval.startTime.getTime() / 1000,
				nanos: 0,
			},
			endTime: {
				seconds: interval.endTime.getTime() / 1000,
				nanos: 0,
			},
		},
	};

	const [timeSeries] = await client.listTimeSeries(request);
	console.log("Time series data:");
	timeSeries.forEach((data) => {
		console.log(`Metric: ${data?.metric?.type}`);
		console.log("Data points:");
		data?.points?.forEach((point) => {
			console.log(
				`  Value: ${point?.value?.doubleValue || point?.value?.int64Value}, Time: ${point?.interval?.endTime?.seconds}`,
			);
		});
		console.log("---");
	});

	return timeSeries;
};

export const getBackupSuccessRates = (projectId: string, days = 7) => {
	const endTime = new Date();
	const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

	const filter = 'metric.type = "backup.googleapis.com/backup/success_count"';

	return getMonitoringData(projectId, filter, { startTime, endTime });
};

export const getSystemUptime = (projectId: string, days = 7) => {
	const endTime = new Date();
	const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

	const filter = 'metric.type = "compute.googleapis.com/instance/uptime"';

	return getMonitoringData(projectId, filter, { startTime, endTime });
};

export const getSystemPerformanceMetrics = (projectId: string, days = 7) => {
	const endTime = new Date();
	const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

	const filter =
		'metric.type = "compute.googleapis.com/instance/cpu/utilization"';

	return getMonitoringData(projectId, filter, { startTime, endTime });
};

export const listSecurityAssets = async (organizationId: string) => {
	const securityCenter = new SecurityCenterClient();

	const [assets] = await securityCenter.listAssets({
		parent: `organizations/${organizationId}`,
	});

	console.log("Security assets:");
	assets.forEach((asset) => {
		console.log(`Name: ${asset?.asset?.name}`);
		console.log(
			`Type: ${asset?.asset?.securityCenterProperties?.resourceType}`,
		);
		console.log(
			`Project: ${asset?.asset?.securityCenterProperties?.resourceProject}`,
		);
		console.log("---");
	});

	return assets;
};

export const getBigQueryDatasets = async (projectId: string) => {
	const bigquery = new BigQuery();

	const [datasets] = await bigquery.getDatasets({ projectId });
	console.log("Datasets:");
	datasets.forEach((dataset) => console.log(dataset.id));

	return datasets;
};
