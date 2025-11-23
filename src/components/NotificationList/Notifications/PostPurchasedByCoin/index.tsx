import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const PostPurchasedByCoin = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc="/modic-coin.svg"
    title={data.title}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/art/${data.postId}`}
  />
);

export default PostPurchasedByCoin;
