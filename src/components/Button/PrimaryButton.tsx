"use client";

import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({
  text,
  disabled = false,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full h-[56px] rounded-[8px] transition duration-200",
        disabled
          ? "bg-[#E5E6EB]"
          : "bg-[#FF5100] hover:opacity-90"
      )}
      style={{
        color: disabled ? "var(--Grayscale-400, #9E9FAD)" : "#FFFFFF",
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
