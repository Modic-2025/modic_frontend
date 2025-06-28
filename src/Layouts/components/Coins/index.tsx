"use client";
import Image from "next/image";
import { commonClassNames } from "..";

const Coins = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className={`${commonClassNames} basis-1/6 ml-auto inline-flex items-center text-sm font-bold`}
      onClick={onClick ? onClick : () => {}}
    >
      <span className="inline-flex items-center gap-1 ml-auto">
        <Image
          src="/Coin.svg"
          alt="back"
          className="ml-auto"
          width={18}
          height={18}
        />
        10개
      </span>
    </div>
  );
};

export default Coins;
