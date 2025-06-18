"use client";
import Image from "next/image";

const Backward = () => {
  return (
    <div
      className="cursor-pointer basis-1/10"
      onClick={() => window.history.back()}
    >
      <Image src="/icon_arrow_left.svg" alt="back" width={24} height={24} />
    </div>
  );
};

export default Backward;
