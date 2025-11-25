"use client";

import _fetch from "@/APIs/fetcher/ClientSide";
import search, { PagingContent } from "@/APIs/search";
import { NO_SEARCH_RESULTS_USER } from "@/components/ContentViewer/placeholders";
import TemplateLoading from "@/components/Templates";
import UserInfo from "@/components/UserInfo";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import { FollowUser } from "@/types/User";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

const SearchUserContent = ({ keyword }: { keyword: string }) => {
  const [page, setPage] = useState<number>(0);

  const { data, isLoading, error } = useSWRInfinite<PagingContent<FollowUser>>(
    () => {
      const params = new URLSearchParams();
      params.append("keyword", keyword);
      params.append("page", `${page}`);
      params.append("size", `20`);
      return `${process.env.NEXT_PUBLIC_API_HOST}/api/users/search?${params.toString()}`;
    },
    (url: string) =>
      _fetch(url, true).then((response) =>
        response.json().then((parsed) => parsed.data)
      )
  );

  const isLast = data && data[data.length - 1].isLast;
  const users = (data && data.flatMap((item) => [...item.content])) || [];

  if (isLoading) {
    <TemplateLoading title={"사용자 검색 중 .."} />;
  }
  if (users && users.length <= 0) {
    return <NO_SEARCH_RESULTS_USER />;
  }

  const onMoreUsers = () => {
    if (isLast) return;
    setPage(page + 1);
  };

  return <UserList users={users} onMoreUsers={onMoreUsers} />;
};

const UserList = ({
  users,
  onMoreUsers,
}: {
  users: FollowUser[];
  onMoreUsers: () => void;
}) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });

  useEffect(() => {
    onMoreUsers();
  }, [isInView]);
  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.userId}
          className="py-4 border-b border-(--color-gray-1) last:border-none"
        >
          <UserInfo
            title={user.userName}
            href={`/users/${user.userId}`}
            src={""}
            // src={user.userImageUrl}
          />
        </li>
      ))}
      {ref && typeof ref === "object" && <div ref={ref}></div>}
    </ul>
  );
};

export default SearchUserContent;
