import _fetch from "@/APIs/fetcher/ClientSide";
import useSWR from "swr";

const useNotificationCount = () => {
  const fetcher = async (path: string) => {
    const res = await (
      await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, true)
    ).json();
    const { data } = res;
    return data.unreadCount;
  };
  return useSWR("/api/notifications/unread-count", fetcher, {
    refreshInterval: 10000,
  });
};

export default useNotificationCount;
