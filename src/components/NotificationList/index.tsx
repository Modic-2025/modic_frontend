import _fetch from "@/APIs/fetcher/ClientSide";
import { TypePaging } from "@/types";
import { Notification } from "@/types/Notification";
import useSWRInfinite from "swr/infinite";
import { AlertForm, CenteredLayout } from "../Layout";
import TemplateLoading from "../Templates";
import PostPurchasedByCoin from "./Notifications/PostPurchasedByCoin";
import CoinReceived from "./Notifications/CoinReceived";
import DerivedPostCreated from "./Notifications/DerivedPostCreated";
import Followed from "./Notifications/Followed";
import PostPurchasedByTicket from "./Notifications/PostPurchasedByTicket";
import PostReviewed from "./Notifications/PostReviewed";
import NotificationTemplate from "./Notifications";

const NOT_DEFINED_NOTIFICATION: Notification = {
  notificationId: -1,
  type: "404",
  status: "READ",
  title: "정의되지 않은 알림",
  body: "",
  postId: -1,
  createdAt: new Date(),
};
type NotificationPagingData = TypePaging & {
  content: Notification[];
};
const NotificationList = () => {
  const { data, isLoading, error } = useSWRInfinite<NotificationPagingData>(
    (index, prevPageData) => {
      if (prevPageData && prevPageData.isLast) return null; // stop
      const page = index; // API is 0-based -> index maps directly
      const searchParams = new URLSearchParams({
        size: "20",
        page: String(page),
      });
      return `${process.env.NEXT_PUBLIC_API_HOST}/api/notifications?${searchParams.toString()}`;
    },
    (url: string) =>
      _fetch(url, true).then(async (res) => {
        const body = await res.json();
        if (!body.isSuccess) {
          throw body;
        }
        const { data } = body;
        const safeData = {
          ...data,
          content: data.content.map((notiItem: Notification) => ({
            ...notiItem,
            createdAt: new Date(notiItem.createdAt),
          })),
        };
        return safeData as NotificationPagingData;
      }),
    {
      revalidateIfStale: false, // 캐시가 있다면 마운트 시에도 요청 안 함
      revalidateOnFocus: false, // 창 포커스 시 요청 안 함
      revalidateOnReconnect: false, // 네트워크 복구 시 요청 안 함
      revalidateFirstPage: false, // 추가 페이지 로드 시 첫 페이지 갱신 안 함
      refreshInterval: 0, // 주기적 갱신 끔
      persistSize: true, // 페이지 수 유지
    }
  );

  const renderNotiByType = (noti: Notification) => {
    switch (noti.type) {
      case "COIN_RECEIVED":
        return <CoinReceived data={noti} />;
      case "DERIVED_POST_CREATED":
        return <DerivedPostCreated data={noti} />;
      case "FOLLOWED":
        return <Followed data={noti} />;
      case "POST_PURCHASED_BY_COIN":
        return <PostPurchasedByCoin data={noti} />;
      case "POST_PURCHASED_BY_TICKET":
        return <PostPurchasedByTicket data={noti} />;
      case "POST_REVIEWED":
        return <PostReviewed data={noti} />;
      default:
        return (
          <NotificationTemplate
            iconSrc="/warning.svg"
            title={NOT_DEFINED_NOTIFICATION.title}
            date={NOT_DEFINED_NOTIFICATION.createdAt}
            body={NOT_DEFINED_NOTIFICATION.body}
            isUnread={false}
            postId={NOT_DEFINED_NOTIFICATION.postId}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <CenteredLayout>
        <TemplateLoading title="알림을 가져오는 중 .." />
      </CenteredLayout>
    );
  }

  const flattenedNotis = data?.flatMap((page) => page.content);
  if (!flattenedNotis || flattenedNotis.length <= 0) {
    return (
      <CenteredLayout>
        <AlertForm title="알림이 없습니다." />
      </CenteredLayout>
    );
  }

  return (
    <ul>
      {flattenedNotis.map((notiItem: Notification) =>
        renderNotiByType(notiItem)
      )}
    </ul>
  );
};

export default NotificationList;
