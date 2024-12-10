import { TokenCredential, AccessToken } from "@azure/core-auth";

export class StaticTokenCredential implements TokenCredential {
  constructor(private accessToken: AccessToken) {}
  async getToken(): Promise<AccessToken> {
    return this.accessToken;
  }
}
