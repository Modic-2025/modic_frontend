import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const PostReviewed = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc="/modic-coin.svg"
    title={data.body}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/art/${data.postId}/reviews`}
  />
);

export default PostReviewed;
