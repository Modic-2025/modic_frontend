export type NotificationType =
  | "COIN_RECEIVED"
  | "POST_PURCHASED_BY_COIN"
  | "POST_PURCHASED_BY_TICKET"
  | "POST_REVIEWED"
  | "FOLLOWED"
  | "DERIVED_POST_CREATED"
  | "404";
export type NotificationStatus = "READ" | "UNREAD";
export type Notification = {
  notificationId: number;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  body: string;
  postId: number;
  createdAt: Date;
};
