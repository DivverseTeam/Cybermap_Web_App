import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

// Initialize Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1", // Specify the region if needed
});

// Define the structure of the expected request body
interface ForgotPasswordRequest {
  email: string;
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as ForgotPasswordRequest;

    if (!body.email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Start Forgot Password process
    const command = new ForgotPasswordCommand({
      ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
      Username: body.email,
    });

    await cognitoClient.send(command);

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset email sent successfully. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initiating forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initiate password reset." },
      { status: 500 }
    );
  }
}
