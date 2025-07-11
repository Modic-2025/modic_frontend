export type Review = {
  userName: string;
  hasUserImage: Boolean;
  userImageUrl: string;
  createdAt: Date;
  postReviewId: number;
  description: string;
  imageUrls: Array<string>;
};
