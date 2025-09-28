export type ImageType = { imageUrl: string; imageId: number };

export interface DerivedPost {
  postId: number;
  imageUrl: string;
}

export interface Art_thumbnail {
  postId: number;
  title: string;
  images: ImageType[];
  likeCount: number;
}

export interface Art extends Art_thumbnail {
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  userId: number;
  userName: string;
  userEmail: string;
  tags: Array<string>;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  isAiDerivedPost: boolean;
  derivedPosts: DerivedPost[];
}
