import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

type TypeResponseData = {
  ticketCount: number;
};
const getTickets = async (): Promise<number | APIFailureMsg> => {
  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/ai/tickets/me`, true)
  ).json();
  console.log("response :>> ", response);

  const { status, data }: { status: number; data: TypeResponseData } = response;

  switch (status) {
    case 500: // 500
      return { code: status, title: TITLE_500 };
  }

  const { ticketCount } = data;

  return ticketCount;
};

export default getTickets;
