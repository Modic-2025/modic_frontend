"use client"; // 클라이언트 컴포넌트 선언

import { useState, useEffect, useRef } from "react";
import useSearchPosts from "@/APIs/useSearchPosts";
import { Art_thumbnail } from "@/types/Art";
import ContentViewer from "@/components/ContentViewer";
import { NO_SEARCH_RESULTS_POST } from "@/components/ContentViewer/placeholders";
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

const SearchClient = () => {
  // const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [allResults, setAllResults] = useState<Art_thumbnail[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [tabs] = useState<UITab[]>(TABS);

  const { data, error, isLoading } = useSearchPosts(searchKeyword, page, 20);

  const observerTarget = useRef<HTMLDivElement>(null);

  // ... (기존 useEffect 로직들 그대로 유지) ...
  useEffect(() => {
    if (!error && data?.isSuccess) {
      const { content, hasNext: nextPage } = data.data;
      if (content) {
        if (page === 0) {
          setAllResults(content);
        } else {
          setAllResults((prev) => [...prev, ...content]);
        }
        setHasNext(nextPage);
      }
    }
  }, [data, error, page]);

  useEffect(() => {
    setPage(0);
    setAllResults([]);
    setHasNext(false);
  }, [searchKeyword]);

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

  return (
    <main className="overflow-y-auto h-full flex flex-col gap-2">
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
            <NO_SEARCH_RESULTS_POST />
          </ContentViewer>

          {hasNext && searchKeyword && !isLoading && allResults.length > 0 && (
            <div ref={observerTarget} className="py-4 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SearchClient;
