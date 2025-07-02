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
        src="/IconMenuDotted.svg"
        alt="back"
        className="ml-auto"
        width={18}
        height={18}
      />
    </div>
  );
};

export default OptionDotted;
