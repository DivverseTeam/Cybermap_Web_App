import { env } from "~/env";
import type { ModuleOptions } from "simple-oauth2";
import type { Oauth2Provider } from "~/lib/types/integrations";

export const Oauth2ProviderConfigMap: Record<Oauth2Provider, ModuleOptions> = {
  GOOGLE: {
    client: {
      id: "",
      secret: "",
    },
    auth: {
      tokenHost: "",
    },
  },
  MICROSOFT: {
    client: {
      id: env.AZURE_CLIENT_ID,
      secret: env.AZURE_CLIENT_SECRET,
    },
    auth: {
      tokenHost: "https://login.microsoftonline.com",
      tokenPath: `/${env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
      authorizePath: `/${env.AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize`,
    },
  },
};

export const MICROSOFT_OAUTH_SCOPE =
  "User.Read User.Read.All Directory.Read.All AuditLog.Read.All UserAuthenticationMethod.Read.All";
