import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

// Initialize Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1", // Specify the region if needed
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    // Start Forgot Password process
    const command = new ForgotPasswordCommand({
      ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
      Username: email,
    });

    await cognitoClient.send(command);

    return res.status(200).json({
      success: true,
      message:
        "Password reset email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error initiating forgot password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to initiate password reset." });
  }
}
