"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TypeProp = {
  initKeyword?: string;
  onSearch?: (keyword: string) => void;
};
const SearchBar = ({ initKeyword, onSearch }: TypeProp) => {
  const [keyword, setKeyword] = useState<string>(initKeyword ?? "");

  useEffect(() => {
    setKeyword(initKeyword ?? "");
  }, [initKeyword]);

  // Enter 키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      handleOnSearch(keyword);
    }
  };
  const onSearchBtnClick = () => {
    handleOnSearch(keyword);
  };

  const handleOnSearch = (_keyword: string) => {
    if (!_keyword && !_keyword.trim()) return;

    onSearch && onSearch(_keyword);
  };

  return (
    <>
      {/* 검색 입력 */}
      <div className="sticky top-0 bg-white z-10 ">
        {/* 중앙 정렬 컨테이너 */}
        <div className="flex justify-center">
          {/* 검색창 컨테이너 - 디자인 명세 적용 */}
          <div className="flex items-center justify-between w-full max-w-[390px] h-[44px] pl-[14px] pr-[15px] py-[10px] border-b border-[#F3F4F6]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="원하는 작품 및 작가를 검색하세요!"
              autoFocus
              className="flex-1 outline-none text-base"
            />
            <button onClick={onSearchBtnClick} className="flex-shrink-0 ml-2">
              <Image src="/Search.svg" alt="search" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
