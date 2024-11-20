import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

async function isEmailVerified(accessToken: string): Promise<boolean> {
  try {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await cognitoClient.send(command);

    const emailVerified = response.UserAttributes?.find(
      (attr) => attr.Name === "email_verified"
    )?.Value;

    return emailVerified === "true";
  } catch (error) {
    console.error("Error checking email verification:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const url = req.nextUrl.clone();

  // Allow access to the landing page and API routes
  if (url.pathname === "/" || url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect to login if no token exists
  if (!token) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Check email verification
  const isVerified = await isEmailVerified(token);

  if (!isVerified) {
    url.pathname = "/verify-email";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Protect all routes except specific paths
};
