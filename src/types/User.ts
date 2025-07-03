export type User = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
};

export type UserMe = {
  id: number;
  email: string;
  nickname: string;
};
