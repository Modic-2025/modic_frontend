"use client";

import { useState, useEffect, useRef } from "react";
import useSearchPosts from "@/APIs/useSearchPosts";
import { Art_thumbnail } from "@/types/Art";
import ContentViewer from "@/components/ContentViewer";
import { NO_SEARCH_RESULTS } from "@/components/ContentViewer/placeholders";
import Tab, { UITab } from "@/components/Tab";

const TABS: UITab[] = [
  {
    name: "게시글",
    activated: true,
  },
  {
    name: "사용자",
    activated: false,
  },
];

export default function SearchPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [allResults, setAllResults] = useState<Art_thumbnail[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [tabs, setTabs] = useState<UITab[]>(TABS);

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
        if (
          entries[0].isIntersecting &&
          hasNext &&
          !isLoading &&
          searchKeyword
        ) {
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
    <main className="overflow-y-auto h-full flex flex-col gap-2">
      {/* 검색 결과 */}
      {!searchKeyword ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">검색어를 입력해주세요</p>
        </div>
      ) : (
        <>
          <Tab tabs={tabs} />
          <ContentViewer
            arts={allResults}
            grid={2}
            mode="PRESENTATIONAL"
            showTabs={false}
          >
            <NO_SEARCH_RESULTS />
          </ContentViewer>
          {/* <SearchContentViewer
              arts={allResults}
              isLoading={isLoading}
              error={error}
            /> */}

          {/* 무한 스크롤 로딩 인디케이터 */}
          {hasNext && searchKeyword && !isLoading && allResults.length > 0 && (
            <div ref={observerTarget} className="py-4 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
