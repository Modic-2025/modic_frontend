"use client";
import Image from "next/image";
import { commonClassNames } from "../..";
import { useTicketCount } from "@/APIs/ai/tickets/me/hook";

const Tickets = ({ onClick }: { onClick?: () => void }) => {
  const { ticketCount, isLoading, error } = useTicketCount();

  return isLoading || error ? (
    <></>
  ) : (
    <div
      className={`${commonClassNames} basis-1/6 inline-flex items-center text-sm font-bold`}
      onClick={onClick ? onClick : () => {}}
    >
      <span className="inline-flex items-center gap-1 ml-auto">
        <Image
          src="/ticket-gray-2.svg"
          alt="back"
          className="ml-auto"
          width={18}
          height={18}
        />
        {ticketCount}개
      </span>
    </div>
  );
};

export default Tickets;
