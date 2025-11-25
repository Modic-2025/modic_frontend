import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const Followed = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc={
      data.hasSenderImage ? data.senderImageUrl : "/temporary/anonymous.svg"
    }
    title={data.title}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/users/${data.senderId}/followers`}
  />
);

export default Followed;
