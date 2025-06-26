"use client";
import { useEffect, useState } from "react";

// 현재 접속 경로를 기반으로 기본 Title을 가져오는 함수
const getTitleFromPath = (path: string): string | null => {
  // [동적 경로]
  // /art/[hash]/chat 패턴 확인
  if (/^\/users\/[^\/]+\$/.test(path)) {
    return "";
  }

  // [정적 경로]
  switch (path) {
  }

  return null;
};

const Title = ({ specificValue }: { specificValue: string }) => {
  const [cWindow, setCWindow] = useState<Window | null>(null);

  useEffect(() => {
    setCWindow(window);
  }, []);

  return (
    <div className="w-full text-center">
      <h1 className="text-lg font-bold text-center">
        {specificValue
          ? specificValue
          : getTitleFromPath(cWindow ? cWindow.location.pathname : "")}
      </h1>
    </div>
  );
};

export default Title;
