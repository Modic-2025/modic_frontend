"use client";
import { Art_thumbnail } from "@/types/Art";
import React, { useEffect, useRef, useState } from "react";
import ArtCard from "@/components/ArtCard";
import useArts, { ArtPagingData, sortType } from "@/APIs/useArts";
import Image from "next/image";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import { ERROR_FORM } from "./placeholders";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = Array<Array<Art_thumbnail>>;

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

const ContentViewer = ({
  children,
  mode = "NORMAL",
  showTabs = true,
  onClickPost,
  ...rest
}: {
  children?: React.ReactNode; // use as placeholder
  mode?: "NORMAL" | "DERIVED" | "PRESENTATIONAL"; // NORMAL: default, DERIVED: use in my image gen page
  grid: gridType;
  arts?: Art_thumbnail[]; // If set `arts`, component do not fetch arts
  showTabs?: boolean;
  userId?: number; // Get arts by user
  me?: boolean; // Get arts by own session
  onClickPost?: (content: Art_thumbnail) => void;
}) => {
  // Intersection observer
  const [observeRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });

  const safeUserId = typeof rest.me === "boolean" && rest.me ? -1 : rest.userId;
  const [grid, setGrid] = useState<gridType>(rest.grid); // grid number
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>(); // grid에 맞게 배치된 arts
  const [tabs, setTabs] = useState<Array<tab>>(C_TABS); // Category tabs

  const selectedTab = tabs.find((item) => item.selected);
  const getPagingKey = (index: number, prevPageData: ArtPagingData | null) => {
    const searchParams = new URLSearchParams();
    // searchParams.append("postType", "ALL");
    searchParams.append("size", "20");
    // 첫 페이지
    if (!prevPageData) {
      searchParams.append("page", "0");
      return `${process.env.NEXT_PUBLIC_API_HOST}/api/posts?${searchParams.toString()}`;
    }

    // 마지막 페이지 도달
    if (prevPageData.isLast) {
      return null;
    }

    // 다음 페이지
    searchParams.append("page", `${index + 1}`);
    return `${process.env.NEXT_PUBLIC_API_HOST}/api/posts?${searchParams.toString()}`;
  };
  const [page, setPage] = useState<number>(0);
  const { data, error, isLoading } = useArts(
    rest.arts
      ? null
      : ((selectedTab ? selectedTab.value : "LATEST") as sortType),
    page,
    20,
    getPagingKey,
    safeUserId
  );

  /**
   * mode === "PRESENTATIONAL"일 경우, prop의 art를 사용하게 됩니다.
   */
  const [targetArts, setTargetArts] = useState<Art_thumbnail[] | undefined>(
    mode === "PRESENTATIONAL"
      ? rest.arts
      : data && data.flatMap((page) => page.content)
  );

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
        : data && data.flatMap((page) => page.content)
    );
  }, [data, rest.arts]);

  // 추가 데이터를 fetch하는 시점을 감지한다.
  useEffect(() => {
    // 마지막 페이지의 isLast를 검사한다.
    const isLastPage = data && data[data.length - 1].isLast;
    console.log("isLastPage :>> ", isLastPage);
    // last가 아닐 경우 fetch한다.
    if (!isLastPage && isInView) {
      setPage(page + 1);
    }
  }, [isInView]);

  useEffect(() => {
    console.log("page updated :>> ", page);
  }, [page]);

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
  if (error) {
    return <ERROR_FORM title={error.info.message} desc={error.status} />;
  }

  return (
    <>
      {/* Tab */}
      {isRenderTabs && (
        <nav className="flex flex-row pb-4 font-semibold">
          {tabs.map((item, idx) => (
            <Tab key={idx} item={item} onClick={tabOnClickListener} />
          ))}{" "}
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
                      key={
                        isDisplayDerivedPost
                          ? art.images[0].imageId
                          : art.postId
                      }
                      className="mb-4"
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
