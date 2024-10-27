import React from "react";
import EvidenceLibraryPage from "~/containers/evidence-library/EvidenceLibraryPage";
import type { SearchParams } from "~/types";

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function page(props: PageProps) {
	const searchParams = await props.searchParams;
	return <EvidenceLibraryPage searchParams={searchParams} />;
}
