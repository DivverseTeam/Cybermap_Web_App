import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

// Initialize Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1", // Specify the region if needed
});

// Define the structure of the expected request body
interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

// POST handler for password reset
export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = (await request.json()) as ResetPasswordRequest;
    const { email, verificationCode, newPassword } = body;

    if (!email || !verificationCode || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Confirm Forgot Password process with the code and new password
    const command = new ConfirmForgotPasswordCommand({
      ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
      Username: email,
      ConfirmationCode: verificationCode,
      Password: newPassword,
    });

    await cognitoClient.send(command);

    return NextResponse.json(
      { success: true, message: "Your password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error confirming forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password." },
      { status: 500 }
    );
  }
}
