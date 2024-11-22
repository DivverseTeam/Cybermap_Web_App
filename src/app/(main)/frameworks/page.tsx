import FrameworksPage from "~/containers/frameworks/Frameworks";
import type { Metadata } from "next";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Frameworks",
};

export default async function Page() {
  const frameworksWithCompletion =
    await api.frameworks.getFrameworksWithCompletion();

  return <FrameworksPage frameworks={frameworksWithCompletion} />;
}
