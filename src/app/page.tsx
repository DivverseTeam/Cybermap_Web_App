import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/signin");
  }
}
