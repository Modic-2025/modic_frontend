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
  return (
    <div
      className={`${commonClassNames} basis-1/10`}
      onClick={onClick ? onClick : () => {}}
    >
      {goTo ? (
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
