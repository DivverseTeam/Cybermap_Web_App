import { DefaultAzureCredential } from "@azure/identity";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";

export const triggerPolicyComplianceScan = async (subscriptionId: string) => {
	const credential = new DefaultAzureCredential();
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
