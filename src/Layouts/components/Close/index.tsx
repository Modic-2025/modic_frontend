"use client";
import Image from "next/image";
import { commonClassNames } from "..";

const Close = ({ backToPath }: {backToPath: string}) => {
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={() => window.history.back()}
    >
      <Image src="/icon_arrow_left.svg" alt="back" width={24} height={24} />
    </div>
  );
};

export default Close;
