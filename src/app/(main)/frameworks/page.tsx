import FrameworksPage from "~/containers/frameworks/Frameworks";
import type { Metadata } from "next";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Frameworks",
};

export default function Page() {
  void api.frameworks.getWithCompletion.prefetch();
  return <FrameworksPage />;
}
