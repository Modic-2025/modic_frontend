"use client";

import _fetch from "@/APIs/fetcher/ClientSide";
import { PagingContent } from "@/APIs/search";
import { NO_SEARCH_RESULTS_USER } from "@/components/ContentViewer/placeholders";
import Fail from "@/components/Popups/Fail";
import TemplateLoading from "@/components/Templates";
import UserInfo from "@/components/UserInfo";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import UsePopup from "@/hooks/UsePopup";
import { FollowUser } from "@/types/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

const SearchUserContent = ({ keyword }: { keyword: string }) => {
  const router = useRouter();

  const [page, setPage] = useState<number>(0);

  const { data, isLoading, error } = useSWRInfinite<PagingContent<FollowUser>>(
    () => {
      const params = new URLSearchParams();
      params.append("keyword", keyword);
      params.append("page", `${page}`);
      params.append("size", `20`);
      return `${process.env.NEXT_PUBLIC_API_HOST}/api/users/search?${params.toString()}`;
    },
    (url: string) => {
      return _fetch(url, true).then(async (res) => {
        const body = await res.json();
        if (!body.isSuccess) {
          throw body;
        }
        return body.data;
      });
    }
  );
  const [isOpen, setIsOpen, title, setTitle, desc, setDesc] = UsePopup(false);

  // 세션 만료 (401) redirecting 처리
  useEffect(() => {
    if (error) {
      console.log("error :>> ", error);
      const { status, message, code } = error;
      setIsOpen(true);
      setTitle(`${message} (${code})`);

      if (status === 401) {
        setDesc("잠시 후 로그인 페이지로 이동합니다.");
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    }
  }, [error]);

  const isLast = data && data[data.length - 1].isLast;
  const users = data && data.flatMap((item) => [...item.content]);
  console.log("users :>> ", users);
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

  return (
    <>
      {isOpen && error && <Fail title={title} desc={desc} />}
      {users && <UserList users={users} onMoreUsers={onMoreUsers} />}
    </>
  );
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
            src={user.userImageUrl}
          />
        </li>
      ))}
      {ref && typeof ref === "object" && <div ref={ref}></div>}
    </ul>
  );
};

export default SearchUserContent;
