import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const CoinReceived = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    key={data.notificationId}
    iconSrc="/modic-coin.svg"
    title={data.title}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
  />
);

export default CoinReceived;
