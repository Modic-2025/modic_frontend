import search, { TypeSearchContent } from "@/APIs/search";
import { APIFailureMsg } from "@/APIs";
import Error from "../_error";
import SearchUserContent from "./content";
import PlaceHolder from "..";
import { FollowUser } from "@/types/User";

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

  // const response: TypeSearchContent<FollowUser> | APIFailureMsg =
  //   await search<FollowUser>("USER", safeKeyword, 0, 20);
  // if ("code" in response) {
  //   return <Error data={response} />;
  // }

  return <SearchUserContent keyword={safeKeyword} />;
};

export default SearchUserPage;
