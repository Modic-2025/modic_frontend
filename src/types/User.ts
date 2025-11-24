export type User = UserMe & {
  userId: number; // tech dept
  profileImageUrl?: string;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
};

export type FollowUser = {
  userId: number;
  hasUserImage: boolean;
  userImageUrl: string;
  userName: string;
  userEmail: string;
};
// in session
export type FollowUserWithStatus = FollowUser & {
  isFollowing: boolean;
};

export type UserMe = {
  userId: number;
  userEmail: string;
  userName: string;
  hasUserImage: boolean;
  userImageUrl: string;
  userImageId: number;
  postCount: number;
  followerCount: number;
  followingCount: number;
  coin: number;
};
