"use client";
import { Art_thumbnail, GeneratedImageType } from "@/types/Art";
import React, { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";
import useArts, { ArtPagingData, sortType } from "@/APIs/useArts";
import Image from "next/image";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import { ERROR_FORM } from "./placeholders";
import usePrevious from "@/hooks/UsePrevious";
import { AlertForm, CenteredLayout } from "../Layout";
import useSWRInfinite from "swr/infinite";
import _fetch from "@/APIs/fetcher/ClientSide";
import { useRouter } from "next/navigation";
import Fail from "../Popups/Fail";
import UsePopup from "@/hooks/UsePopup";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = (Art_thumbnail | GeneratedImageType)[][];

type tab = {
  value: string;
  name: string;
  selected?: boolean;
};

const C_TABS: Array<tab> = [
  { value: "LATEST", name: "최신순", selected: true },
  { value: "HOTTEST", name: "인기순" },
  { value: "FOLLOWING", name: "팔로잉" },
];

type TypeMode = "NORMAL" | "DERIVED" | "MY" | "USER" | "PRESENTATIONAL";
const getAPIPathByMode = (mode: TypeMode) => {
  switch (mode) {
    case "NORMAL":
      return "/api/posts";
    case "DERIVED":
      return "/api/ai/images/my-generated";
    case "MY":
      return "/api/profiles/me/posts";
    case "USER":
      return "/api/profiles/posts";
    // case "PRESENTATIONAL":
    //   return "/api/posts";
    default:
      return "/api/posts";
  }
};
const ContentViewer = ({
  children,
  mode = "NORMAL",
  showTabs = true,
  onClickPost,
  ...rest
}: {
  children?: React.ReactNode; // use as placeholder
  // NORMAL: default
  // DERIVED: use in my image gen page
  // MY: Session own posts
  // USER: User posts
  // PRESENTATIONAL: work as presentational component
  mode?: "NORMAL" | "DERIVED" | "MY" | "USER" | "PRESENTATIONAL";
  grid: gridType;
  arts?: Art_thumbnail[]; // If set `arts`, component do not fetch arts
  showTabs?: boolean;
  userId?: number; // Get arts by user
  me?: boolean; // Get arts by own session
  onClickPost?: (content: Art_thumbnail | GeneratedImageType) => void;
}) => {
  const router = useRouter();

  // Intersection observer
  const [observeRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });
  const prevIsInView = usePrevious(isInView);

  const safeUserId = typeof rest.me === "boolean" && rest.me ? -1 : rest.userId;
  const [grid, setGrid] = useState<gridType>(rest.grid); // grid number
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>(); // grid에 맞게 배치된 arts
  const [tabs, setTabs] = useState<Array<tab>>(C_TABS); // Category tabs
  const [isOpen, setIsOpen, title, setTitle, desc, setDesc] = UsePopup(false);

  const selectedTab = tabs.find((item) => item.selected);

  const getPagingKey = React.useCallback(
    (index: number, prevPageData: ArtPagingData | null) => {
      // first page: index === 0, prevPageData === null (normal)
      if (prevPageData && prevPageData.isLast) return null; // stop
      const apiPath: string = getAPIPathByMode(mode);
      const page = index; // API is 0-based -> index maps directly
      const searchParams = new URLSearchParams({
        size: "20",
        page: String(page),
      });
      if (mode === "USER") {
        if (!rest.userId) {
          console.error(
            "[ERROR] mode === 'USER' 이지만, rest.userId가 존재하지 않음"
          );
          return `${process.env.NEXT_PUBLIC_API_HOST}${apiPath}?${searchParams.toString()}`;
        }
        searchParams.append("userId", rest.userId?.toString() ?? "-1");
      }
      return `${process.env.NEXT_PUBLIC_API_HOST}${apiPath}?${searchParams.toString()}`;
    },
    [mode]
  );
  const [page, setPage] = useState<number>(0);
  const { data, error, isLoading, size, setSize } =
    useSWRInfinite<ArtPagingData>(
      getPagingKey,
      (url: string) =>
        _fetch(url, true).then(async (res) => {
          const body = await res.json();
          if (!body.isSuccess) {
            throw body;
          }
          return body.data as ArtPagingData;
        }),
      {
        revalidateIfStale: false, // 캐시가 있다면 마운트 시에도 요청 안 함
        revalidateOnFocus: false, // 창 포커스 시 요청 안 함
        revalidateOnReconnect: false, // 네트워크 복구 시 요청 안 함
        revalidateFirstPage: false, // 추가 페이지 로드 시 첫 페이지 갱신 안 함
        refreshInterval: 0, // 주기적 갱신 끔
        persistSize: true, // 페이지 수 유지
      }
      // rest.arts
      // ? null
      // (selectedTab ? selectedTab.value : "LATEST") as sortType,
      // page,
      // 20,
      // getPagingKey,
      // safeUserId,
    );

  /**
   * mode === "PRESENTATIONAL"일 경우, prop의 art를 사용하게 됩니다.
   */
  const [targetArts, setTargetArts] = useState<
    Art_thumbnail[] | GeneratedImageType[] | undefined
  >(
    mode === "PRESENTATIONAL"
      ? rest.arts
      : data && data.length > 0
        ? data.flatMap((page) => page.content)
        : []
  );
  // console.log("targetArts :>> ", targetArts);

  // 레이아웃 데이터 계산
  useEffect(() => {
    if (targetArts) {
      if (targetArts.length > 0 && grid) {
        const artsByGrid: artsByGridType = [];
        targetArts.map((art, index) => {
          const gridIndex = index % grid;
          if (artsByGrid[gridIndex]) {
            artsByGrid[gridIndex].push(art);
          } else {
            artsByGrid[gridIndex] = [art];
          }
        });
        setArtsByGrid(artsByGrid);
      }
    }
  }, [targetArts, grid]);

  // Sync SWR hook arts data or prop arts data to target arts state
  useEffect(() => {
    setTargetArts(
      mode === "PRESENTATIONAL"
        ? rest.arts
        : data && data.length > 0
          ? data.flatMap((page) => page.content)
          : []
    );
  }, [data, rest.arts]);

  useEffect(() => {
    // 마지막 페이지의 isLast를 검사한다.
    const isLastPage = data && data[data.length - 1]?.isLast;
    // console.log("isLastPage :>> ", isLastPage);
    // console.log("isInView :>> ", isInView);
    // console.log("prevIsInView :>> ", prevIsInView);
    if (!isLastPage && isInView && !prevIsInView) {
      // ask SWR to load next page
      setSize((s: number) => (s ?? 0) + 1);
    }
  }, [isInView, prevIsInView, data, setSize]);

  // 세션 만료 (401) redirecting 처리
  useEffect(() => {
    if (error) {
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

  /**
   * Event listeners
   */
  // On click tabs
  const tabOnClickListener = (tabValue: string) => {
    setTabs(
      tabs.map((item) => ({
        ...item,
        selected: item.value == tabValue,
      }))
    );
  };

  /**
   * Intuitive rendering flags
   */
  // Rendering tabs
  const isRenderTabs = typeof showTabs == "boolean" && showTabs;
  const isDisplayDerivedPost = mode === "DERIVED";

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <Image
          src="/MODIC.svg"
          alt="MODIC"
          width={180}
          height={100}
          className="motion-preset-blink motion-duration-1000 [--motion-loop-opacity:0.6]"
        />
        <h1 className="text-(--color-gray-4) font-bold text-xl mt-4">
          그림을 가져오는 중 ..
        </h1>
      </div>
    );
  }

  // Error case
  // if (error) {
  //   const { status, message, code } = error;
  //   switch (status) {
  //     case 401:
  //       return (
  //         <ERROR_FORM
  //           title={`${message} (${code})`}
  //           desc={`잠시후 로그인 페이지로 이동합니다.`}
  //         />
  //       );
  //     default:
  //       return (
  //         <ERROR_FORM
  //           title="서버에서 에러가 발생하였습니다."
  //           desc="잠시후 다시 이용해주세요"
  //         />
  //       );
  //   }
  // }

  return (
    <>
      {/* Popup */}
      {isOpen && error && <Fail title={title} desc={desc} />}

      {/* Tab */}
      {isRenderTabs && (
        <nav className="flex flex-row pb-4 font-semibold">
          {tabs.map((item, idx) => (
            <Tab key={idx} item={item} onClick={tabOnClickListener} />
          ))}
        </nav>
      )}

      {/* Content */}
      {targetArts && targetArts.length <= 0 ? (
        children
      ) : (
        <>
          <div className={`content-viewer flex flex-row gap-4`}>
            {artsByGrid &&
              artsByGrid.map((_, index) => (
                <div key={index} className="basis-1/2">
                  {_.map((art, artIndex) => (
                    <div
                      key={isDisplayDerivedPost ? art.imageUrl : art.postId}
                      className="relative mb-4"
                    >
                      <ArtCard
                        data={art}
                        onClick={isDisplayDerivedPost ? onClickPost : undefined}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
          {observeRef && typeof observeRef === "object" && (
            <div ref={observeRef}></div>
          )}
        </>
      )}
    </>
  );
};

const Tab = ({
  item,
  onClick,
}: {
  item: tab;
  key: number;
  onClick: (value: string) => void;
}) => {
  return (
    <button
      onClick={() => onClick(item.value)}
      className={`basis-1/3 cursor-pointer ${item.selected ? "text-[#FF5100] underline decoration-2 underline-offset-4" : ""}`}
    >
      {item.name}
    </button>
  );
};

export default ContentViewer;
