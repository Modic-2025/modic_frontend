"use client";
import { Art_thumbnail } from "@/types/Art";
import React, { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";
import useArts from "@/APIs/useArts";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = Array<Array<Art_thumbnail>>;

const ContentViewer = (props: {
  grid: gridType;
  arts?: Array<Art_thumbnail>;
}) => {
  const [arts, setArts] = useState<Array<Art_thumbnail>>(props.arts);
  const [grid, setGrid] = useState<gridType>(props.grid);
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>();

  const { data, error, isLoading } = useArts();

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
      const { content } = data.data;
      console.log("content :>> ", content);
      if (content) {
        console.log("content :>> ", content);
        setArts(content);
      }
    }
  }, [data]);

  if (isLoading) {
    return <p> 작품 가져오는 중 .. </p>;
  }

  if (error) {
    return (
      <>
        <p> 작품 데이터를 가져오는중 오류가 발생했습니다. </p>
        <p> 잠시 후 다시 시도해주세요 </p>
      </>
    );
  }

  return (
    <div className={`content-viewer flex flex-row gap-4`}>
      {artsByGrid &&
        artsByGrid.map((_, index) => (
          <div key={index} className="basis-1/2">
            {_.map((art, index) => (
              <div key={art.id} className="mb-4">
                <ArtCard key={index} data={art} />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default ContentViewer;
