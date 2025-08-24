export type ImageType = { imageUrl: string; imageId: string };

export interface Art_thumbnail {
  postId: number;
  images: Array<ImageType>;
}

export interface Art extends Art_thumbnail {
  title: string;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  userId: number;
  userName: string;
  userEmail: string;
  tags: Array<string>;
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

// /api/profiles 컨트롤러에서 반환하는 post 객체 (임시)
export interface Art_thumbnail_profiles {
  postId: number;
  imageUrl: string;
}
