import SearchUserContent from "./content";
import PlaceHolder from "..";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const SearchUserPageContent = async ({
  searchParams,
}: {
  searchParams: any;
}) => {
  const q = searchParams.q ?? "";
  const safeKeyword = q && q.trim();
  if (!safeKeyword) {
    return <PlaceHolder />;
  }

  // const response: PagingContent<FollowUser> | APIFailureMsg =
  //   await search<FollowUser>("USER", safeKeyword, 0, 20);
  // if ("code" in response) {
  //   return <Error data={response} />;
  // }

  return <SearchUserContent keyword={safeKeyword} />;
};

const SearchUserPage = ({ searchParams }: { searchParams: any }) => (
  <Suspense>
    <SearchUserPageContent searchParams={searchParams} />
  </Suspense>
);

export default SearchUserPage;
