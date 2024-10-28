import React from "react";
import PageTitle from "~/containers/dashboard/components/PageTitle";
// import EvidenceLibraryPage from "~/containers/evidence-library/EvidenceLibraryPage";
import EvidenceTable from "~/containers/evidence-libraryss/EvidenceTable";

interface HomeProps {
  searchParams: { [key: string]: string | undefined };
}

export default function page({ searchParams }: HomeProps) {
  return <EvidenceTable searchParams={searchParams} />;
}
