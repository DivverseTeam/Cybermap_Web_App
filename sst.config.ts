/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "cybermap",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
					profile:
						input?.stage === "production"
							? "cybermap-production"
							: "cybermap-dev",
				},
			},
		};
	},
	// biome-ignore lint/suspicious/useAwait: <explanation>
	async run() {
		const bucket = new sst.aws.Bucket("images", {
			access: "public",
		});
		new sst.aws.Nextjs("cybermap", {
			link: [bucket],
		});
	},
});
