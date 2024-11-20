import type { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION, // Your region
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await client.send(command);

    const emailVerified = response.UserAttributes?.find(
      (attr) => attr.Name === "email_verified"
    )?.Value;

    return res.status(200).json({ emailVerified: emailVerified === "true" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user attributes" });
  }
}
