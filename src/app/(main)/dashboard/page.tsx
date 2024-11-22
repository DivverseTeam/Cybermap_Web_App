import DashboardPage from "~/containers/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function HomePage() {
  return <DashboardPage />;
}
