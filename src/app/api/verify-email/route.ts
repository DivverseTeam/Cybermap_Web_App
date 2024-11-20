import { NextResponse } from "next/server";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";
import jwt, { type JwtHeader } from "jsonwebtoken"; // Import if using JSON Web Tokens (JWT)

// Initialize Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

// Define the expected structure of the decoded token
interface DecodedToken {
  email: string;
  sub: string; // Cognito User ID
}

// Fetch the public key from the Cognito JWK endpoint
interface Jwk {
  kid: string;
  x5c: string[];
  alg: string;
  use: string;
  n: string;
  e: string;
}

interface JwkSet {
  keys: Jwk[];
}

// Define the expected structure of the request body
interface RequestBody {
  token: string;
}

async function getPublicKey(
  userPoolId: string,
  region: string
): Promise<Jwk[]> {
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await fetch(jwksUrl);
  const data = (await response.json()) as JwkSet;
  return data.keys;
}

export async function POST(request: Request) {
  try {
    // Parse the JSON request body and assert its type
    const body = (await request.json()) as RequestBody; // Explicitly cast to RequestBody
    const token: string = body.token;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    // Get the User Pool ID dynamically from SST's resources
    const userPoolId = Resource.user.id; // Access UserPool ID directly from the SST resource
    const region = process.env.AWS_REGION || "us-east-1"; // Use region from environment or default

    if (!userPoolId || !region) {
      return NextResponse.json(
        { success: false, message: "User Pool ID or Region missing" },
        { status: 500 }
      );
    }

    // Get public keys from Cognito's JWKS endpoint
    const keys = await getPublicKey(userPoolId, region);

    // Decode the JWT header to get the Key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true }) as unknown;

    // Narrow down the type to `JwtHeader` safely
    const header = decodedHeader as JwtHeader | null;

    if (!header || !header.kid) {
      return NextResponse.json(
        { success: false, message: "Invalid JWT header" },
        { status: 401 }
      );
    }

    const key = keys.find((k) => k.kid === header.kid);

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Unable to find matching key" },
        { status: 401 }
      );
    }

    // Convert the key to a usable public key format
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`;

    // Verify the JWT with the public key
    const decoded = jwt.verify(token, publicKey) as DecodedToken;

    // Validate the decoded token structure
    if (typeof decoded !== "object" || !decoded) {
      throw new Error("Invalid token structure");
    }

    const { email, sub } = decoded;

    if (!email || !sub) {
      throw new Error("Missing required fields in token");
    }

    // Mark email as verified in Cognito
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: sub,
      UserAttributes: [{ Name: "email_verified", Value: "true" }],
    });

    await cognitoClient.send(command);

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
