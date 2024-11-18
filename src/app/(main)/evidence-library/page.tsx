import React from "react";
import EvidenceLibraryPage from "~/containers/evidence-library/EvidenceLibraryPage";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function page({ searchParams }: HomeProps) {
  return <EvidenceLibraryPage searchParams={await searchParams} />;
}
