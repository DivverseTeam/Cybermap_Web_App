import type { FrameworkName } from "~/lib/types";

export const FRAMEWORKS_ONBOARDING: Array<{
  title: string;
  list: Array<FrameworkName>;
}> = [
  {
    title: "Industry recommendation",
    list: ["ISO27001"],
  },
  // {
  //   title: "More frameworks",
  //   list: [FRAMEWORKS_ENUM.HIPAA, FRAMEWORKS_ENUM.GDPR, FRAMEWORKS_ENUM.PCIDSS],
  // },
];
