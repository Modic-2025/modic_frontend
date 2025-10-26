"use client";

import { Art_thumbnail } from "@/types/Art";
import React, { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";

type artsByGridType = Array<Array<Art_thumbnail>>;

interface SearchContentViewerProps {
  arts: Art_thumbnail[];
  isLoading: boolean;
  error: any;
}

const SearchContentViewer = ({
  arts,
  isLoading,
  error,
}: SearchContentViewerProps) => {
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>();

  // 그리드 배치 로직 (2열 고정)
  useEffect(() => {
    if (arts && arts.length > 0) {
      const gridData: artsByGridType = [];
      arts.forEach((art, index) => {
        const gridIndex = index % 2; // 2열 고정
        if (gridData[gridIndex]) {
          gridData[gridIndex].push(art);
        } else {
          gridData[gridIndex] = [art];
        }
      });
      setArtsByGrid(gridData);
    } else {
      setArtsByGrid(undefined);
    }
  }, [arts]);

  // 로딩 중 (초기 로드)
  if (isLoading && arts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">검색 중...</p>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">검색 중 오류가 발생했습니다</p>
        <p className="text-gray-400 text-sm mt-2">잠시 후 다시 시도해주세요</p>
      </div>
    );
  }

  // 검색 결과 없음
  if (arts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">검색 결과가 없습니다</p>
      </div>
    );
  }

  // 검색 결과 표시
  return (
    <div className="content-viewer flex flex-row gap-4">
      {artsByGrid &&
        artsByGrid.map((column, columnIndex) => (
          <div key={columnIndex} className="basis-1/2">
            {column.map((art) => (
              <div key={art.postId} className="mb-4">
                <ArtCard data={art} />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default SearchContentViewer;
