import type { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export default async function resendVerificationCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
        Username: email,
      });

      await cognitoClient.send(command);
      return res.status(200).json({ message: "Verification email sent" });
    } catch (_error) {
      return res
        .status(500)
        .json({ error: "Failed to resend verification email" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
