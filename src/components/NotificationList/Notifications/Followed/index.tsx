import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const Followed = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc="/temporary/anonymous.svg"
    title={data.title}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/users/me/followers`}
  />
);

export default Followed;
