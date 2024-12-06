import type { ModuleOptions } from "simple-oauth2";
import { env } from "~/env";
import type { Oauth2Provider } from "~/lib/types/integrations";
import type { IntegrationOauth2Props } from "../api/routers/general";

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
    },
  },
};

export const MICROSOFT_OAUTH_ARM_SCOPE =
  "https://management.azure.com/.default";

export const MICROSOFT_OAUTH_SCOPE =
  "offline_access User.Read User.Read.All Directory.Read.All AuditLog.Read.All UserAuthenticationMethod.Read.All Group.Read.All IdentityProvider.Read.All RoleManagement.Read.All RoleManagementAlert.Read.Directory Device.Read.All Policy.Read.All ServicePrincipalEndpoint.Read.All Subscription.Read.All";

export const getOauth2Config = (props: IntegrationOauth2Props) => {
  const { provider } = props;

  if (provider === "MICROSOFT") {
    const { tenantId } = props;

    const microsoftConfig = Oauth2ProviderConfigMap.MICROSOFT;

    return {
      ...microsoftConfig,
      auth: {
        ...microsoftConfig.auth,
        tokenPath: `/${tenantId}/oauth2/v2.0/token`,
        authorizePath: `/${tenantId}/oauth2/v2.0/authorize`,
      },
    };
  }

  if (provider === "GOOGLE") {
    const googleConfig = Oauth2ProviderConfigMap.GOOGLE;
    return {
      ...googleConfig,
      auth: {
        ...googleConfig.auth,
        tokenHost: `https://oauth2.googleapis.com`,
      },
    };
  }

  throw new Error("Unsupported OAuth2 provider.");
};
