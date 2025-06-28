"use client";
import Image from "next/image";
import { commonClassNames } from "..";

const Tickets = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className={`${commonClassNames} basis-1/6 inline-flex items-center text-sm font-bold`}
      onClick={onClick ? onClick : () => {}}
    >
      <span className="inline-flex items-center gap-1 ml-auto">
        <Image
          src="/Ticket.svg"
          alt="back"
          className="ml-auto"
          width={18}
          height={18}
        />
        1/3
      </span>
    </div>
  );
};

export default Tickets;
