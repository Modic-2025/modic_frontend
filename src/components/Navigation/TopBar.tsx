"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full max-w-[390px] h-[44px] px-[14px] border-b border-[#F3F4F6]">
      {/* 왼쪽 아이콘: 뒤로가기 */}
      <button onClick={() => router.back()}>
        <Image
          src="/icon_arrow_left.svg"
          alt="뒤로가기"
          width={24}
          height={24}
        />
      </button>

      {/* 오른쪽 아이콘: 닫기 */}
      <Image
        src="/icon_close.svg"
        alt="닫기"
        width={24}
        height={24}
      />
    </div>
  );
}
