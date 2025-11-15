"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { commonClassNames } from "../../index";

const Search = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/search/art");
    }
  };

  return (
    <div className={`${commonClassNames} basis-1/10`} onClick={handleClick}>
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
