import { type NextRequest, NextResponse } from "next/server";
import { AuthorizationCode } from "simple-oauth2";

import { getServerAuthSession } from "~/server/auth";
import { Client } from "@microsoft/microsoft-graph-client";
import Organisation from "~/server/models/Organisation";
import { Oauth2Provider } from "~/lib/types/integrations";
import {
  Oauth2ProviderConfigMap,
  Oauth2ProviderIntegrationIdsMap,
} from "~/lib/constants/integrations";
import { env } from "~/env";

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
    return NextResponse.json(
      { error: "Invalid provider specified in the callback URL" },
      { status: 400 },
    );
  }

  const session = await getServerAuthSession();

  if (!session || !session?.user?.organisationId) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const code = searchParams.get("code");
  if (!code) {
    console.error("Authorization code is missing in the callback URL.");
    return NextResponse.redirect(
      new URL("/error?message=missing_code", req.url),
    );
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
      return NextResponse.redirect(
        new URL("/error?message=organisation_not_found", req.url),
      );
    }

    organisation.integrations =
      organisation.integrations.concat(integrationsToAdd);

    await organisation.save();

    const user = await getUserDetails(access_token as string);

    console.log(user);

    return NextResponse.redirect(
      new URL(`/integrations?${provider}=success`, req.url),
    );
  } catch (error) {
    console.error("Error during OAuth2 token exchange:", error);
    return NextResponse.redirect(
      new URL("/integrations?message=token_exchange_failed", req.url),
    );
  }
}
