"use client";
import Image from "next/image";

const Option = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className="cursor-pointer basis-1/10"
      onClick={onClick ? onClick : () => {}}
    >
      <Image
        src="/Menu.svg"
        alt="back"
        className="mr-0"
        width={24}
        height={24}
      />
    </div>
  );
};

export default Option;
