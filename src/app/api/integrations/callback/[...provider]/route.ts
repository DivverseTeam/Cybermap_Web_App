import { type NextRequest, NextResponse } from "next/server";
import { AuthorizationCode } from "simple-oauth2";

import { getServerAuthSession } from "~/server/auth";
import { Client } from "@microsoft/microsoft-graph-client";
import Organisation from "~/server/models/Organisation";
import { Oauth2Provider } from "~/lib/types/integrations";
import { Oauth2ProviderIntegrationIdsMap } from "~/lib/constants/integrations";
import { env } from "~/env";
import { Oauth2ProviderConfigMap } from "~/server/constants/integrations";

async function getUserDetails(accessToken: string) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  return await client.api("/me").get();
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { provider } =
    req.nextUrl.pathname.match(/callback\/(?<provider>\w+)/)?.groups || {};

  const parsedProvider = Oauth2Provider.safeParse(provider?.toUpperCase());

  if (!parsedProvider.success) {
    console.error("Invalid provider specified in the callback URL.");
    throw new Error("Invalid provider specified in the callback URL.");
  }

  const session = await getServerAuthSession();

  if (!session || !session?.user?.organisationId) {
    console.error("User session not found or organisation ID missing.");
    throw new Error("User session not found or organisation ID missing.");
  }

  const code = searchParams.get("code");

  if (!code) {
    console.error("Authorization code is missing in the callback URL.");
    throw new Error("Authorization code is missing in the callback URL.");
  }

  const options = {
    code,
    redirect_uri: `${env.BASE_URL || "http://localhost:3000"}/api/integrations/callback/${provider}`,
  };

  try {
    const client = new AuthorizationCode(
      Oauth2ProviderConfigMap[parsedProvider.data],
    );

    console.log("Attempting to exchange code for an access token...");
    const accessToken = await client.getToken(options);

    console.log("Access Token Successfully Retrieved:", accessToken);

    const { token } = accessToken;
    const { access_token, refresh_token, expires_at } = token;

    const integrationIds = Oauth2ProviderIntegrationIdsMap[parsedProvider.data];

    const integrationsToAdd = integrationIds.map((id) => ({
      id,
      connectedAt: new Date(),
      authData: {
        accessToken: access_token as string,
        refreshToken: refresh_token as string,
        expiry: new Date(expires_at as string),
      },
    }));

    const organisation = await Organisation.findById(
      session.user.organisationId,
    );

    if (!organisation) {
      throw new Error("Organisation not found");
    }

    organisation.integrations =
      organisation.integrations.concat(integrationsToAdd);

    await organisation.save();

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
  }
}
