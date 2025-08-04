export const getReviews = async (
  postId: number,
  page?: number,
  size?: number
) => {
  if (!postId) {
    return null;
  }
  const params = new URLSearchParams();
  params.append("postId", postId.toString());
  params.append("page", (page || 1).toString());
  params.append("size", (size || 10).toString());

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/post-reviews?${params.toString()}`
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch review of post");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    throw new Error("Failed to load review of post");
  }
  const reviews = custom_response.data;
  return reviews;
};
