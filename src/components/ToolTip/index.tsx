import React, { useState } from "react";

type TypeToolTip = {
  children: React.ReactNode;
  text: string;
  duration?: number;
};
const ToolTip = ({ children, text, duration = 500 }: TypeToolTip) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const id = setTimeout(() => {
      setIsShow(true);
    }, duration);
    setTimeoutId(id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsShow(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    setIsShow(true);
  };

  // children이 유효한 React element면 기존 props를 보존하며 이벤트 병합해서 주입
  if (React.isValidElement(children)) {
    const existingOnMouseEnter = (children.props as any).onMouseEnter;
    const existingOnMouseLeave = (children.props as any).onMouseLeave;
    const existingOnClick = (children.props as any).onClick;

    const merged = React.cloneElement(children, {
      onMouseEnter: (e: React.MouseEvent) => {
        existingOnMouseEnter?.(e);
        handleMouseEnter(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        existingOnMouseLeave?.(e);
        handleMouseLeave(e);
      },
      onClick: (e: React.MouseEvent) => {
        existingOnClick?.(e);
        handleClick(e);
      },
    });

    return (
      <>
        {isShow && (
          <div
            className={`motion-preset-fade motion-duration-${duration} absolute -top-12 left-1/2 -translate-x-1/2 overflow-auto w-full shadow-lg bg-white text-xs rounded-lg p-1 text-(--color-gray-4)`}
            onClick={() => {
              setIsShow(false);
            }}
          >
            {text}
          </div>
        )}
        {merged}
      </>
    );
  }

  // 그 외(텍스트 등)일 경우 wrapper에 이벤트를 붙임
  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isShow && (
        <div
          className={`motion-preset-fade motion-duration-${duration} absolute -top-12 left-1/2 -translate-x-1/2 overflow-auto w-full shadow-lg bg-white text-xs rounded-lg p-1 text-(--color-gray-4)`}
          onClick={() => {
            setIsShow(false);
          }}
        >
          {text}
        </div>
      )}
      {children}
    </span>
  );
};

export default ToolTip;
