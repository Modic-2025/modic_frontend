export type ImageType = { imageUrl: string; imageId: number };

export interface DerivedPost {
  postId: number;
  imageUrl: string;
}

export interface Art_thumbnail {
  postId: number;
  title?: string;
  images: [ImageType, ...ImageType[]];
  likeCount?: number;
}

export type PostStatus =
  | "ORIGINAL"
  | "DERIVED_PENDING"
  | "DERIVED_APPROVED"
  | "DERIVED_REJECTED";
export interface Art extends Art_thumbnail {
  userName: string;
  hasUserImage: boolean;
  userImageUrl: string;
  userEmail: string;
  userId: number;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  ticketPrice: number;
  postStatus: PostStatus;
  isLikedByCurrentUser: boolean;
  derivedPosts: DerivedPost[];
}

export interface GeneratedImageType extends ImageType {
  postId: number;
  fromOriginImage: boolean; // For ai-generated image
  aiChatRoomId: number; // For ai-generated image
}
