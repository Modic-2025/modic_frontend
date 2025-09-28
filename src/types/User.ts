export type User = UserMe & {
  userId: number; // tech dept
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
  userId: number;
  userEmail: string;
  userName: string;
  hasUserImage: boolean;
  userImageUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  coin: number;
};
