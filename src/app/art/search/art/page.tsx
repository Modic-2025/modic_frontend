import search, { TypeSearchContent } from "@/APIs/search";
import { Art_thumbnail } from "@/types/Art";
import SearchArtContent from "./content";
import { APIFailureMsg } from "@/APIs";
import { AlertForm } from "@/components/Layout";
import PlaceHolder from "..";
import Error from "../_error";

const SearchArtPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const q = searchParams.q ?? "";
  const safeKeyword = q && q.trim();
  if (!safeKeyword) {
    return <PlaceHolder />;
  }

  const response: TypeSearchContent<Art_thumbnail> | APIFailureMsg =
    await search<Art_thumbnail>("POST", safeKeyword, 0, 20);
  if ("code" in response) {
    return <Error data={response} />;
  }

  return <SearchArtContent data={response} />;
};

export default SearchArtPage;
