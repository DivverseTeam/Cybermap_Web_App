import { GetObjectCommand } from "@aws-sdk/client-s3";
import { GetParameterCommand } from "@aws-sdk/client-ssm";
import { s3Client, ssmClient } from "../init";

/**
 * Fetch BAA contract from an S3 bucket.
 * Evidence: Proof that third parties handling PHI have signed agreements ensuring compliance.
 */
export const fetchBAAContractFromS3 = async (
  bucketName: string,
  key: string
) => {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3Client.send(command);
    return await streamToBuffer(response.Body); // Helper function to handle the stream
  } catch (error) {
    console.error("Error fetching BAA contract from S3:", error);
    throw error;
  }
};

/**
 * Fetch AWS BAA agreement status from SSM Parameter Store.
 * Evidence: Proof of the AWS BAA agreement ensuring HIPAA compliance for workloads running on AWS.
 */
export const fetchAWSBAAStatusFromSSM = async (parameterName: string) => {
  try {
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    console.error("Error fetching AWS BAA status from SSM:", error);
    throw error;
  }
};

// Helper function to convert stream to buffer
const streamToBuffer = (stream: any) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
