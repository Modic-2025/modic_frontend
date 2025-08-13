export type User = UserMe & {
  profileImageUrl?: string;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  coin?: number;
};

export type FollowUser = {
  userId: number;
  hasUserImage: boolean;
  userImageUrl: string;
  userName: string;
  userEmail: string;
};

export type UserMe = {
  id: number;
  email: string;
  nickname: string;
};
