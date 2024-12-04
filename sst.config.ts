/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cybermap",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          version: "6.61.0",
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
    const imagesBucket = new sst.aws.Bucket("images", {
      access: "public",
    });

    const evidencesBucket = new sst.aws.Bucket("evidences", {});

    const policyTemplatesBucket = new sst.aws.Bucket("policy-templates", {
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
      link: [
        imagesBucket,
        userPool,
        userPoolClient,
        evidencesBucket,
        policyTemplatesBucket,
      ],
    });
  },
});
