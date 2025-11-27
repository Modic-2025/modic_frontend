import search, { PagingContent } from "@/APIs/search";
import { Art_thumbnail } from "@/types/Art";
import SearchArtContent from "./content";
import { APIFailureMsg } from "@/APIs";
import PlaceHolder from "..";
import Error from "../_error";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const SearchArtPageContent = async ({
  searchParams,
}: {
  searchParams: any;
}) => {
  const q = (searchParams?.q as string) ?? "";
  const safeKeyword = q.trim();
  if (!safeKeyword) {
    return <PlaceHolder />;
  }

  const response: PagingContent<Art_thumbnail> | APIFailureMsg =
    await search<Art_thumbnail>("POST", safeKeyword, 0, 20);
  if ("code" in response) {
    return <Error data={response} />;
  }

  return <SearchArtContent data={response} />;
};

const SearchArtPage = ({ searchParams }: { searchParams: any }) => (
  <Suspense>
    <SearchArtPageContent searchParams={searchParams} />
  </Suspense>
);

export default SearchArtPage;
