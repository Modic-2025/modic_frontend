"use client";
import Image from "next/image";
import { commonClassNames } from "../../index";

const Search = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={onClick ? onClick : () => {}}
    >
      <Image
        src="/Search.svg"
        alt="back"
        className="ml-auto"
        width={18}
        height={18}
      />
    </div>
  );
};

export default Search;
