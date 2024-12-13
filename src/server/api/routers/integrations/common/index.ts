import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { ControlStatus } from "~/lib/types/controls";

export interface AzureToken {
  token: string;
  expiresOnTimestamp: number;
  subscriptionId: string;
}

export interface AzureAUth {
  azureCloud: AzureToken | null;
  azureAd: AzureToken | null;
}

async function evaluate(functions: (() => Promise<ControlStatus | null>)[]) {
  try {
    const statuses = await Promise.all(functions.map((fn) => fn()));

    if (
      statuses.every(
        (status) => status === ControlStatus.Enum.FULLY_IMPLEMENTED
      )
    ) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (
      statuses.some((status) => status === ControlStatus.Enum.NOT_IMPLEMENTED)
    ) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error: any) {
    console.log("Error in evaluate", error);
    if (
      error.code === "ExpiredAuthenticationToken" ||
      error.code === "InvalidAuthenticationToken"
    ) {
      throw error;
    }
  }
}

async function saveEvidence(data: any) {
  const id = new mongoose.Types.ObjectId().toString();

  const client = new S3Client({});

  let bucket: string = "evidence-library";

  let key: string = id;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 60 * 60 });
}

export { evaluate, saveEvidence };
