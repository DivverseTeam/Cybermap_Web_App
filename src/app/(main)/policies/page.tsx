import Policies from "~/containers/policies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
};

export default function page() {
  return <Policies />;
}
