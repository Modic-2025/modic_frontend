export type Review = {
  userName: string;
  hasUserImage: boolean;
  userImageUrl: string;
  createdAt: Date;
  postReviewId: number;
  description: string;
  imageUrls: Array<string>;
};
