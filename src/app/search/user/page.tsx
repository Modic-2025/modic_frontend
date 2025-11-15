import search, { TypeSearchContent } from "@/APIs/search";
import { Art_thumbnail } from "@/types/Art";
import { APIFailureMsg } from "@/APIs";
import Error from "../_error";
import SearchUserContent from "./content";
import PlaceHolder from "..";

const SearchUserPage = async ({
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
    await search<Art_thumbnail>("USER", safeKeyword, 0, 20);
  console.log("response :>> ", response);
  if ("code" in response) {
    return <Error data={response} />;
  }

  return <SearchUserContent data={response} />;
};

export default SearchUserPage;
