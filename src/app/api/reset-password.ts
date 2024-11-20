import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
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

  const { email, verificationCode, newPassword } = req.body;

  if (!email || !verificationCode || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Confirm Forgot Password process with the code and new password
    const command = new ConfirmForgotPasswordCommand({
      ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
      Username: email,
      ConfirmationCode: verificationCode,
      Password: newPassword,
    });

    await cognitoClient.send(command);

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("Error confirming forgot password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to reset password." });
  }
}
