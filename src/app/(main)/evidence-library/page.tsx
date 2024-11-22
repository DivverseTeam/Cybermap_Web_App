import React from "react";
import EvidenceLibraryPage from "~/containers/evidence-library/EvidenceLibraryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evidence Library",
};

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function page({ searchParams }: HomeProps) {
  return <EvidenceLibraryPage searchParams={await searchParams} />;
}
