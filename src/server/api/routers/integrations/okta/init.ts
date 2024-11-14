import { Client } from "@okta/okta-sdk-nodejs";

const TIME_FRAME = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // last 24 hours

const oktaClient = new Client({
  orgUrl: "https://your-okta-domain.okta.com",
  token: "your-okta-api-token",
});

export { oktaClient, TIME_FRAME };
