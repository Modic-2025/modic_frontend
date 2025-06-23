"use client";
import Image from "next/image";
import { commonClassNames } from "../..";

const OptionDotted = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={onClick ? onClick : () => {}}
    >
      <Image
        src="/IconMenuLined.svg"
        alt="back"
        className="mr-0"
        width={24}
        height={24}
      />
    </div>
  );
};

export default OptionDotted;
