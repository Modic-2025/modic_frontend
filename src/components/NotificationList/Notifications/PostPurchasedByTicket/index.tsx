import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const PostPurchasedByTicket = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc="/ticket_custom.svg"
    title={data.body}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/art/${data.postId}`}
  />
);

export default PostPurchasedByTicket;
