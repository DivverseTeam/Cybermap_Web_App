/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cybermap",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "Shegezzy",
          // input?.stage === "production"
          // 	? "cybermap-production"
          // 	: "cybermap-dev",
        },
      },
    };
  },
  // biome-ignore lint/suspicious/useAwait: <explanation>
  async run() {
    const bucket = new sst.aws.Bucket("images", {
      access: "public",
    });

    const userPool = new sst.aws.CognitoUserPool("user", {
      usernames: ["email"],
    });

    const userPoolClient = userPool.addClient("user-client", {
      transform: {
        client: {
          explicitAuthFlows: ["USER_PASSWORD_AUTH"],
        },
      },
    });

    new sst.aws.Nextjs("cybermap", {
      link: [bucket, userPool, userPoolClient],
    });
  },
});
