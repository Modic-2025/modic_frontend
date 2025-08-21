"use client";
import { Art_thumbnail, Art_thumbnail_profiles } from "@/types/Art";
import React, { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";
import useArts, { sortType } from "@/APIs/useArts";
import { getCookie } from "cookies-next";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = Array<Array<Art_thumbnail | Art_thumbnail_profiles>>;

type tab = {
  value: string;
  name: string;
  selected?: boolean;
  // onClick?: (e:EventListener) => string;
};

const C_TABS: Array<tab> = [
  { value: "LATEST", name: "최신순", selected: true },
  { value: "HOTTEST", name: "인기순" },
  { value: "FOLLOWING", name: "팔로잉" },
];

const ContentViewer = (props: {
  grid: gridType;
  arts?: Array<Art_thumbnail | Art_thumbnail_profiles>;
  showTabs?: boolean;
  userId?: number; // Get arts by user
  me?: boolean; // Get arts by own session
}) => {
  const safeUserId =
    typeof props.me === "boolean" && props.me ? -1 : props.userId;
  const [arts, setArts] = useState<
    Array<Art_thumbnail | Art_thumbnail_profiles>
  >(props.arts ? props.arts : []); // prop arts
  const [grid, setGrid] = useState<gridType>(props.grid); // grid number
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>(); // grid에 맞게 배치된 arts
  const [tabs, setTabs] = useState<Array<tab>>(C_TABS); // Category tabs

  const selectedTab = tabs.find((item) => item.selected);
  const { data, error, isLoading } = useArts(
    (selectedTab ? selectedTab.value : "LATEST") as sortType,
    0,
    20,
    safeUserId,
    getCookie("accessToken")?.toString()
  );

  useEffect(() => {
    if (arts) {
      if (arts.length > 0 && grid) {
        const artsByGrid: artsByGridType = [];
        arts.map((art, index) => {
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
  }, [arts, grid]);

  useEffect(() => {
    if (!error && data) {
      let { content } = data.data;
      if (content) {
        // for /api/profile/posts API (임시)
        if (content.length > 0 && typeof content[0].postId === "number") {
          console.log("captured");
          content = content.map((item) => ({
            id: item.postId,
            images: [{ imageUrl: item.imageUrl }],
          }));
        }
        setArts(content);
      }
    }
  }, [data]);

  if (error) {
    return (
      <>
        <p> 작품 데이터를 가져오는중 오류가 발생했습니다. </p>
        <p> 잠시 후 다시 시도해주세요 </p>
      </>
    );
  }

  const tabOnClickListener = (tabValue: string) => {
    setTabs(
      tabs.map((item) => ({
        ...item,
        selected: item.value == tabValue,
      }))
    );
  };

  const isRenderTabs = typeof props.showTabs == "boolean" && props.showTabs;

  return (
    <>
      {isRenderTabs && (
        <nav className="flex flex-row pb-4 font-semibold">
          {tabs.map((item, idx) => (
            <Tab key={idx} item={item} onClick={tabOnClickListener} />
          ))}{" "}
        </nav>
      )}
      {isLoading ? (
        <p> 작품 가져오는 중 .. </p>
      ) : (
        <div className={`content-viewer flex flex-row gap-4`}>
          {artsByGrid &&
            artsByGrid.map((_, index) => (
              <div key={index} className="basis-1/2">
                {_.map((art, index) => (
                  <div key={art.id ? art.id : art.postId} className="mb-4">
                    <ArtCard key={index} data={art} />
                  </div>
                ))}
              </div>
            ))}
        </div>
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
