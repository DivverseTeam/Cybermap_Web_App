import { SSMClient, DescribePatchGroupsCommand } from "@aws-sdk/client-ssm";
import {
  ListPipelinesCommand,
} from "@aws-sdk/client-codepipeline";
import { codePipelineClient, ssmClient } from "../init";

/**
 * Security reviews evidence
 * Function to get deployment pipelines to verify security checks in the development workflow
 */
export const getDeploymentPipelines = async () => {
  try {
    const command = new ListPipelinesCommand({});
    const response = await codePipelineClient.send(command);
    return response.pipelines; // Contains details of CodePipeline pipelines
  } catch (error) {
    console.error("Error fetching deployment pipelines:", error);
    throw error;
  }
};

/**
 * Patching logs evidence
 * Function to list patch groups to demonstrate patch compliance for instances
 */
export const getPatchGroups = async () => {
  try {
    const command = new DescribePatchGroupsCommand({});
    const response = await ssmClient.send(command);
    return response.Mappings; // Contains patch group compliance details
  } catch (error) {
    console.error("Error fetching patch groups:", error);
    throw error;
  }
};
