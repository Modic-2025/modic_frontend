"use client";

import { TypeSearchContent } from "@/APIs/search";
import { NO_SEARCH_RESULTS } from "@/components/ContentViewer/placeholders";
import UserInfo from "@/components/UserInfo";
import { User } from "@/types/User";

type TypeProp = {
  data: TypeSearchContent<User>;
};
const SearchUserContent = ({ data }: TypeProp) => {
  const { content } = data;

  const noResults = content && content.length <= 0;

  if (noResults) {
    return <NO_SEARCH_RESULTS />;
  }

  return (
    <ul>
      {content.map((user) => (
        <>
          <li className="py-4 border-b border-(--color-gray-1) last:border-none">
            <UserInfo
              title={user.name}
              href={`/users/${user.id}`}
              src={user.userImageUrl}
            />
          </li>
        </>
      ))}
    </ul>
  );
};

export default SearchUserContent;
