// components/inputs/FormInput.tsx
"use client";

import React from "react";

interface FormInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function FormInput({
  type = "text",
  value,
  onChange,
  placeholder,
}: FormInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-[58px] px-4 rounded-[8px] bg-[#F3F4F6]
                 text-black text-[18px] font-medium font-[Pretendard]
                 placeholder-[#9E9FAD] placeholder:font-medium
                 placeholder:text-[18px] placeholder:leading-[25.92px]
                 focus:outline-none"
      style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
    />
  );
}
