import type { NextApiRequest, NextApiResponse } from "next";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";
import jwt, { JwtHeader } from "jsonwebtoken"; // Import if using JSON Web Tokens (JWT)

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

async function getPublicKey(userPoolId: string, region: string) {
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await fetch(jwksUrl);
  const data = await response.json();
  // Type the response data as JwkSet
  const jwks = data as JwkSet;

  return jwks.keys;
}

console.log(Resource);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    // Get the User Pool ID dynamically from SST's resources
    const userPoolId = Resource.user.id; // Access UserPool ID directly from the SST resource
    const region = process.env.AWS_REGION || "us-east-1"; // Use region from environment or default

    if (!userPoolId || !region) {
      return res
        .status(500)
        .json({ success: false, message: "User Pool ID or Region missing" });
    }
    // Get public keys from Cognito's JWKS endpoint
    const keys = await getPublicKey(userPoolId, region);

    // Decode the JWT header to get the Key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true }) as unknown;

    // Narrow down the type to `JwtHeader` safely
    const header = decodedHeader as JwtHeader | null;

    if (!header || !header.kid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid JWT header" });
    }

    const key = keys.find((k) => k.kid === header.kid);

    if (!key) {
      return res
        .status(401)
        .json({ success: false, message: "Unable to find matching key" });
    }

    // Convert the key to a usable public key format
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`;

    // Verify the JWT with the public key
    const decoded = jwt.verify(token, publicKey) as DecodedToken;

    // Validate the decoded token structure
    if (typeof decoded !== "object" || !decoded) {
      throw new Error("Invalid token structure");
    }

    const { email, sub } = decoded as DecodedToken;

    if (!email || !sub) {
      throw new Error("Missing required fields in token");
    }

    // Mark email as verified in Cognito
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: Resource.user.id!,
      Username: sub,
      UserAttributes: [{ Name: "email_verified", Value: "true" }],
    });

    await cognitoClient.send(command);

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
