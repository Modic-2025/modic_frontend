import Image from "next/image";
import { useState } from "react";
import { FormInputProps } from ".";

// `props.type`은 무시됩니다.
const BlindInput = ({ value, onChange, placeholder }: FormInputProps) => {
  const [showValue, setShowValue] = useState<boolean>(false);

  return (
    <div className="relative w-full">
      <input
        type={showValue ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-[58px] px-[16px] pr-10 rounded-[8px] border border-[#9E9FAD] bg-white text-black text-[18px] font-medium font-[Pretendard] placeholder-[#9E9FAD] focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShowValue((prev) => !prev)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <Image
          src={showValue ? "/icon_close_eye.svg" : "/icon_eye.svg"}
          alt="비밀번호 표시 전환"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default BlindInput;
