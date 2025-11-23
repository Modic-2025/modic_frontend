import { Notification } from "@/types/Notification";
import NotificationTemplate from "..";

const DerivedPostCreated = ({ data }: { data: Notification }) => (
  <NotificationTemplate
    iconSrc="/icon-image.svg"
    title={data.title}
    date={data.createdAt}
    body={data.body}
    isUnread={data.status === "UNREAD"}
    postId={data.postId}
    href={`/art/${data.postId}`}
  />
);

export default DerivedPostCreated;
