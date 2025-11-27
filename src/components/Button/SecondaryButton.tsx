"use client";

import React from "react";
import clsx from "clsx";

interface SecondaryButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SecondartButton({
  text,
  disabled = false,
  onClick,
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full h-[56px] rounded-[8px] transition duration-200 cursor-pointer",
        disabled ? "bg-[#E5E6EB]" : "bg-[#FFFFFF] hover:bg-(--color-gray-1)"
      )}
      style={{
        color: disabled ? "var(--Grayscale-400, #9E9FAD)" : "#9E9FAD",
        textAlign: "center",
        fontFeatureSettings: "'liga' off, 'clig' off",
        fontFamily: "Pretendard",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "25.92px",
      }}
    >
      {text}
    </button>
  );
}
