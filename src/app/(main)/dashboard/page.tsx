import DashboardPage from "~/containers/dashboard";
import type { Metadata } from "next";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function HomePage() {
  void api.integrations.get.prefetch();
  void api.frameworks.getWithCompletion.prefetch();

  return <DashboardPage />;
}
