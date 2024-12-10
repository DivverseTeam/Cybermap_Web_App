import { NextResponse, type NextRequest } from "next/server";
import { AuthorizationCode } from "simple-oauth2";

import { Client } from "@microsoft/microsoft-graph-client";
import { Oauth2Provider } from "~/lib/types/integrations";
import { runIso27001 } from "~/server/api/routers/controls/iso27001";
import { IntegrationOauth2Props } from "~/server/api/routers/general";
import { getServerAuthSession } from "~/server/auth";
import { getOauth2Config } from "~/server/constants/integrations";
import Integration from "~/server/models/Integration";
import { env } from "~/env";

async function getUserDetails(accessToken: string) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  return await client.api("/me").get();
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { provider } =
      req.nextUrl.pathname.match(/callback\/(?<provider>[\w-]+)/)?.groups || {};

    const providerName = provider?.split("_")[0];
    const providerResource = provider?.split("_")[1];

    const parsedProvider = Oauth2Provider.parse(providerName?.toUpperCase());

    const session: any = await getServerAuthSession();

    if (!session || !session?.user?.organisationId) {
      console.error("User session not found or organisation ID missing.");
      throw new Error("User session not found or organisation ID missing.");
    }

    const code = searchParams.get("code");

    if (!code) {
      console.error("Authorization code is missing in the callback URL.");
      throw new Error("Authorization code is missing in the callback URL.");
    }

    // Abiola
    const options = {
      code,
      // redirect_uri: `${"http://localhost:3000"}/api/integrations/callback/${provider}`,
      redirect_uri: `${
        env.BASE_URL || "http://localhost:3000"
      }/api/integrations/callback/${provider}`,
    };

    const organisationIntegration = await Integration.findOne({
      organisationId: session.user.organisationId,
      oauthProvider: parsedProvider,
      slug: providerResource,
    });

    if (!organisationIntegration) throw new Error("Integation not found");
    const oauth2Props = IntegrationOauth2Props.parse({
      ...organisationIntegration?.toObject(),
      provider: parsedProvider,
    });

    const client = new AuthorizationCode(getOauth2Config(oauth2Props));

    console.log("Attempting to exchange code for an access token...");
    const accessToken = await client.getToken(options);

    console.log("Access Token Successfully Retrieved:", accessToken);

    const { token } = accessToken;
    const { access_token, refresh_token, expires_at } = token;

    // const savePromises: Array<Promise<Document<unknown>>> = [];

    organisationIntegration.authData = {
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      expiry: new Date(expires_at as string),
    };
    organisationIntegration.connectedAt = new Date();

    organisationIntegration.save();

    const user = await getUserDetails(access_token as string);

    console.log(user);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Authentication Success</title>
        </head>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ success: true }, "*");
            }
            window.close();
          </script>
          <p>Authentication successful. This window will close automatically.</p>
        </body>
      </html>
    `;

    // redirect to this page http://localhost:3000/integrations
    // return NextResponse.redirect(
    //   new URL("/integrations", "http://localhost:3000")
    // );

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error("OAuth2 callback error:", error);
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Authentication Error</title>
        </head>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ success: false, error: "${error?.message}" }, "*");
            }
            window.close();
          </script>
          <p>Authentication failed: ${error?.message}. This window will close automatically.</p>
        </body>
      </html>
    `;
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  } finally {
    runIso27001();
    NextResponse.redirect(new URL("/integrations", "http://localhost:3000"));
  }
}
