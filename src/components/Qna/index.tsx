import type { Qna } from "@/types/Qna";
import Image from "next/image";

const MASKING_STRING = "******";
const Qna = (data: Qna) => {
  const maskedUserName = data.userName.slice(0, 2).concat(MASKING_STRING);
  return (
    <section className="flex">
      <div className="basis-9/10">
        <p className="text-(--color-gray-4) text-sm mb-1"> {maskedUserName}</p>
        <h1 className="mb-2 font-bold text-[16px]">{data.title}</h1>
        <p className="text-sm">
          <span className="text-(--color-gray-4)">
            답변 예정 <span className="text-(--color-gray-1)">|</span>{" "}
            {`${data.createdAt.getFullYear()}.${data.createdAt.getMonth() + 1}.${data.createdAt.getDate()}`}
          </span>
        </p>
      </div>
      <div className="basis-1/10 flex">
        <Image
          src="/IconArrowDown.svg"
          alt="문의 열기"
          className="mx-auto"
          width={24}
          height={24}
        />
      </div>
    </section>
  );
};

export default Qna;
