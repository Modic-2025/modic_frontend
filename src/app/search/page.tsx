"use client";

import { useState, useEffect, useRef } from "react";
import SearchContentViewer from "@/components/SearchContentViewer";
import useSearchPosts from "@/APIs/useSearchPosts";
import { Art_thumbnail } from "@/types/Art";
import Image from "next/image";

export default function SearchPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [allResults, setAllResults] = useState<Art_thumbnail[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);

  const { data, error, isLoading } = useSearchPosts(searchKeyword, page, 20);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 검색 결과 처리
  useEffect(() => {
    if (!error && data?.isSuccess) {
      const { content, hasNext: nextPage } = data.data;
      if (content) {
        if (page === 0) {
          // 새 검색어로 검색한 경우
          setAllResults(content);
        } else {
          // 무한 스크롤로 추가 로드
          setAllResults((prev) => [...prev, ...content]);
        }
        setHasNext(nextPage);
      }
    }
  }, [data, error, page]);

  // 검색어 변경 시 초기화
  useEffect(() => {
    setPage(0);
    setAllResults([]);
    setHasNext(false);
  }, [searchKeyword]);

  // 무한 스크롤 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading && searchKeyword) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNext, isLoading, searchKeyword]);

  // Enter 키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      setSearchKeyword(keyword.trim());
    }
  };

  return (
    <main className="overflow-y-auto">
      {/* 검색 입력 */}
      <div className="sticky top-0 bg-white z-10 py-2">
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
            <button
              onClick={() => keyword.trim() && setSearchKeyword(keyword.trim())}
              className="flex-shrink-0 ml-2"
            >
              <Image src="/Search.svg" alt="search" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <section className="px-4">
        {!searchKeyword ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500">검색어를 입력해주세요</p>
          </div>
        ) : (
          <>
            <SearchContentViewer
              arts={allResults}
              isLoading={isLoading}
              error={error}
            />

            {/* 무한 스크롤 로딩 인디케이터 */}
            {hasNext && searchKeyword && !isLoading && allResults.length > 0 && (
              <div ref={observerTarget} className="py-4 text-center">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
