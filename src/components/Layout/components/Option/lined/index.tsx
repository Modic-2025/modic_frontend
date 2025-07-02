"use client";
import Image from "next/image";
import { commonClassNames } from "../..";

const OptionLined = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={onClick ? onClick : () => {}}
    >
      <Image
        src="/IconMenuLined.svg"
        alt="back"
        className="ml-auto"
        width={24}
        height={24}
      />
    </div>
  );
};

export default OptionLined;
