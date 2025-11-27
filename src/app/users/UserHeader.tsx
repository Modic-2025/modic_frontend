"use client";
import _fetch from "@/APIs/fetcher/ClientSide";
import toggleFollowState from "@/APIs/follows/toggle";
import BlackButton from "@/components/Button/BlackButton";
import GrayBorderButton from "@/components/Button/GrayBorderButton";
import GrayButton from "@/components/Button/GrayButton";
import ClickableImage from "@/components/ClickableImage";
import Fail from "@/components/Popups/Fail";
import { User } from "@/types/User";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

type Counter = {
  title: string;
  value: number;
  href?: string;
};
const USER_COUNTER_KEYS = [
  "postCount",
  "followerCount",
  "followingCount",
  "coin",
] as const;
// 외부에서 보이고 싶지 않은 요소를 지정할 때에도 사용합니다.
type UserCounterKey = (typeof USER_COUNTER_KEYS)[number];
type UI_Counter = Counter & {
  key: UserCounterKey;
};
const UI_COUNTERS: UI_Counter[] = [
  {
    key: "postCount",
    title: "게시물",
    value: -1,
  },
  {
    key: "followerCount",
    title: "팔로워",
    value: -1,
    href: "/users/me/followers",
  },
  {
    key: "followingCount",
    title: "팔로잉",
    value: -1,
    href: "/users/me/followings",
  },
  {
    key: "coin",
    title: "코인",
    value: -1,
    href: "/coins",
  },
];

const UserHeader = ({
  user,
  isAboutMe,
  except,
}: {
  user: User;
  isAboutMe?: boolean;
  except?: UserCounterKey[];
}) => {
  const router = useRouter();
  // "postCount", "coin" 은 무시됩니다.
  const getUserHref = (
    value: "postCount" | "followerCount" | "followingCount" | "coin"
  ) => {
    if (value === "followerCount") {
      return `/users/${user.userId}/followers`;
    }
    return `/users/${user.userId}/followings`;
  };
  const [counters, setCounters] = useState<UI_Counter[]>(
    UI_COUNTERS.map((item) => ({
      ...item,
      value: user[item.key] ?? item.value, // item.value: 서버로부터 받아온 값의 property명이 바뀐 경우 기본 값(-1) 그대로
      href: !isAboutMe ? getUserHref(item.key) : item.href,
    }))
  );

  // states
  const {
    data: followData,
    isLoading,
    error,
    mutate: mutateFollowStatus,
  } = useSWR<{ isFollowing: boolean; isSelf: boolean }>(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/follows/status`,
    (url: string) => {
      const searchParams = new URLSearchParams();
      searchParams.append("userId", user.userId.toString());

      return _fetch(`${url}?${searchParams.toString()}`, true).then(
        async (res) => (await res.json()).data
      );
    }
  );
  // popups
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupDesc, setPopupDesc] = useState<string>("");

  // onClick handlers
  const onClickFollowBtn = async (_isFollow: boolean) => {
    const response = await toggleFollowState(
      user.userId,
      !followData?.isFollowing
    );
    if (typeof response === "boolean" && response) {
      mutateFollowStatus();

      // update followers counter
      setCounters(
        counters.map((item) => ({
          ...item,
          value:
            item.key === "followerCount"
              ? !_isFollow
                ? ++item.value
                : --item.value
              : item.value,
        }))
      );
      return;
    }
    const { code, title, desc } = response;
    setPopupTitle(title);
    setPopupDesc(desc ?? "");
    setShowPopup(true);
    if (code === 404) {
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  };

  return (
    <header className="mb-3">
      {showPopup && (
        <Fail
          title={popupTitle}
          desc={popupDesc}
          onCancel={() => setShowPopup(false)}
        />
      )}
      <div className="flex flex-row justify-between gap-2 px-2">
        <div className="basis-1/4">
          <div className="relative overflow-hidden w-full h-full rounded-full">
            <ClickableImage
              src={user.userImageUrl ?? "/temporary/anonymous.svg"}
              alt="Profile image"
              fill
            />
          </div>
        </div>
        <div className="basis-3/4">
          <p className="mb-2 font-bold">
            {isAboutMe ? user.userName : user.userEmail}{" "}
          </p>
          <ul className="flex flex-row gap-4 text-center">
            {counters.map(
              (item, i) =>
                !except?.find((_item) => _item == item.key) && (
                  <Counter {...item} key={item.key} />
                )
            )}
          </ul>
        </div>
      </div>
      <div className="flex flex-row w-full gap-2 font-bold my-3">
        {isAboutMe ? (
          <>
            {/* <BlackButton href="/users/me/edit">프로필 편집</BlackButton> */}
            {/* <GrayBorderButton href="/coin">코인 충전</GrayBorderButton> */}
          </>
        ) : (
          <>
            {!isLoading && followData?.isFollowing && !followData?.isSelf && (
              <FollowButton
                isFollow={followData?.isFollowing}
                onClick={onClickFollowBtn}
              />
            )}
            {/* <GrayBorderButton href={`/users/${user.userId}/dm`}>
              메시지
            </GrayBorderButton> */}
          </>
        )}
      </div>
    </header>
  );
};

const Counter = ({ title, value, href }: Counter) => (
  <li className="flex-1">
    {href ? (
      <Link href={href}>
        <CounterContent title={title} value={value} />
      </Link>
    ) : (
      <CounterContent title={title} value={value} />
    )}
  </li>
);
type CounterContentProps = Omit<Counter, "href">;
const CounterContent = ({ title, value }: CounterContentProps) => (
  <>
    <p className="font-bold">{value}</p>
    <p className="">{title}</p>
  </>
);

const FollowButton = ({
  isFollow,
  onClick,
}: {
  isFollow: boolean;
  onClick: (isFollow: boolean) => void;
}) => {
  return isFollow ? (
    <GrayButton onClick={() => onClick(isFollow)}>팔로우 취소</GrayButton>
  ) : (
    <BlackButton onClick={() => onClick(isFollow)}>팔로우</BlackButton>
  );
};

export default UserHeader;
