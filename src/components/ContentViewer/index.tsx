"use client";
import { Art_thumbnail } from "@/types/Art";
import React, { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";
import useArts, { sortType } from "@/APIs/useArts";
import { Popup } from "../Popups";
import Image from "next/image";
import PrimaryButton from "../Button/PrimaryButton";
import Link from "next/link";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = Array<Array<Art_thumbnail>>;

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

const ContentViewer = ({
  mode = "NORMAL",
  showTabs = true,
  onClickPost,
  ...rest
}: {
  mode?: "NORMAL" | "DERIVED"; // NORMAL: default, DERIVED: use in my image gen page
  grid: gridType;
  arts?: Art_thumbnail[]; // If set `arts`, component do not fetch arts
  showTabs?: boolean;
  userId?: number; // Get arts by user
  me?: boolean; // Get arts by own session
  onClickPost?: (content: Art_thumbnail) => void;
}) => {
  const safeUserId = typeof rest.me === "boolean" && rest.me ? -1 : rest.userId;
  const [arts, setArts] = useState<Art_thumbnail[] | undefined>(
    rest.arts ?? undefined
  ); // prop arts
  const [grid, setGrid] = useState<gridType>(rest.grid); // grid number
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>(); // grid에 맞게 배치된 arts
  const [tabs, setTabs] = useState<Array<tab>>(C_TABS); // Category tabs

  const selectedTab = tabs.find((item) => item.selected);
  const { data, error, isLoading } = useArts(
    rest.arts
      ? null
      : ((selectedTab ? selectedTab.value : "LATEST") as sortType),
    0,
    20,
    safeUserId
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
  // On click create derived art
  const onClickRegistDerivedArt = () => {};

  /**
   * Intuitive rendering flags
   */
  // Rendering tabs
  const isRenderTabs = typeof showTabs == "boolean" && showTabs;
  const isDisplayDerivedPost = mode === "DERIVED";

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
      {isLoading ? (
        <p> 작품 가져오는 중 .. </p>
      ) : (
        <div className={`content-viewer flex flex-row gap-4`}>
          {artsByGrid &&
            artsByGrid.map((_, index) => (
              <div key={index} className="basis-1/2">
                {_.map((art, index) => (
                  <div
                    key={
                      isDisplayDerivedPost ? art.images[0].imageId : art.postId
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
