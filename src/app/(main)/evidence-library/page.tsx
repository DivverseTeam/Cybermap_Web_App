import React from "react";
import EvidenceLibraryPage from "~/containers/evidence-library/EvidenceLibraryPage";

interface HomeProps {
  searchParams: { [key: string]: string | undefined };
}

export default function page({ searchParams }: HomeProps) {
  return <EvidenceLibraryPage searchParams={searchParams} />;
}
