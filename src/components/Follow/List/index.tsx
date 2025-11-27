"use client";
import UserInfo from "@/components/UserInfo";
import FollowButton from "../Button";
import { FollowUser, FollowUserWithStatus } from "@/types/User";
import useSWRInfinite from "swr/infinite";
import { PagingContent } from "@/APIs/search";
import _fetch from "@/APIs/fetcher/ClientSide";
import { CenteredLayout } from "@/components/Layout";
import TemplateLoading from "@/components/Templates";
// import { useState } from "react";

type modes =
  | "FOLLOWINGS_ME"
  | "FOLLOWERS_ME"
  | "FOLLOWINGS"
  | "FOLLOWINGS_WITH_STATUS"
  | "FOLLOWERS"
  | "FOLLOWERS_WITH_STATUS";
const FollowList = ({
  mode = "FOLLOWERS_ME",
  userId,
}: {
  mode?: modes;
  userId?: number;
}) => {
  const getAPIPath = (_mode: modes) => {
    let path = "/api/follows";
    switch (_mode) {
      case "FOLLOWERS_ME":
        path = path.concat("/followers/me");
        break;
      case "FOLLOWINGS_ME":
        path = path.concat("/followings/me");
        break;
      case "FOLLOWERS":
        path = path.concat("/followers");
        break;
      case "FOLLOWERS_WITH_STATUS":
        path = path.concat("/followers/with-status");
        break;
      case "FOLLOWINGS":
        path = path.concat("/followings");
        break;
      case "FOLLOWINGS_WITH_STATUS":
        path = path.concat("/followings/with-status");
        break;
      default:
        path = path.concat("/followers/me");
    }
    return path;
  };
  const getKey = (index: number) => {
    const searchParams = new URLSearchParams();
    if (userId) {
      searchParams.append("userId", userId.toString());
    }
    searchParams.append("page", `${index}`);
    searchParams.append("size", `20`);

    return `${process.env.NEXT_PUBLIC_API_HOST}${getAPIPath(mode)}?${searchParams.toString()}`;
  };
  const { data: users, isLoading } = useSWRInfinite<
    PagingContent<FollowUserWithStatus>
  >(getKey, (url) =>
    _fetch(url, true).then(async (res) => {
      const body = await res.json();
      if (!body.isSuccess) {
        throw body;
      }
      const followUsers = body.data;

      const isWithStatus =
        mode === "FOLLOWERS_WITH_STATUS" || mode === "FOLLOWINGS_WITH_STATUS";
      return {
        // refactor
        ...followUsers,
        content: followUsers.content.map(
          (user: FollowUserWithStatus | FollowUser) => ({
            ...user,
            isFollowing: isWithStatus
              ? (user as FollowUserWithStatus).isFollowing
              : undefined,
          })
        ),
      };
    })
  );

  if (isLoading) {
    <CenteredLayout>
      <TemplateLoading title={`팔로우 정보를 가져오는 중 ..`} />
    </CenteredLayout>;
  }
  const safeUsers = users?.flatMap((page) => page.content);
  if (!safeUsers || safeUsers.length <= 0) {
    return <p className="text-center"> 목록이 없습니다. </p>;
  }

  return (
    <ul>
      {safeUsers.map((user) => (
        <Item key={user.userId} user={user} />
      ))}
    </ul>
  );
};

const Item = ({ user }: { user: FollowUser | FollowUserWithStatus }) => (
  <li className="flex items-center py-4 border-b border-(--color-gray-1)">
    <div className="w-full">
      <UserInfo
        src={user.userImageUrl}
        href={`/users/${user.userId}`}
        title={user.userName}
        desc={user.userEmail}
      />
    </div>

    {"isFollowing" in user && user.isFollowing && (
      <FollowButton state={user.isFollowing} />
    )}
  </li>
);

export default FollowList;
