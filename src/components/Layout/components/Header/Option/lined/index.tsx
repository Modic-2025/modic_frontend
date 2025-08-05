"use client";
import Image from "next/image";
import { commonClassNames } from "../../..";
import Link from "next/link";

const OptionLined = ({
  onClick,
  goTo,
}: {
  onClick?: () => void;
  goTo?: string;
}) => {
  // onClick, goTo 모두 설정 시 onClick이 우선순위를 갖습니다.
  const isUseOnClick = onClick && !goTo;
  const isUseGoTo = !onClick && goTo && !isUseOnClick;
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={isUseOnClick ? onClick : () => {}}
    >
      {isUseGoTo ? (
        <Link href={goTo}>
          <Icon />
        </Link>
      ) : (
        <Icon />
      )}
    </div>
  );
};

const Icon = () => (
  <Image
    src="/IconMenuLined.svg"
    alt="back"
    className="ml-auto"
    width={24}
    height={24}
  />
);

export default OptionLined;
