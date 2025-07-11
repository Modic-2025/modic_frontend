import { getReviews } from "@/APIs/post-reviews";
import ArtReview from "@/components/ArtReview";
import BottomButton from "@/components/BottomButton";
import { Review } from "@/types/ArtReview";

// Review 타입에 맞는 예시 데이터 10개

const FAKE_REVIEWS: Review[] = [
  {
    userName: "User79",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2023-08-19T04:00:34"),
    postReviewId: 1,
    description: "This is a sample review description x5ue9BRbHukg1syfM320.",
    imageUrls: [],
  },
  {
    userName: "User53",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2025-04-16T05:24:48"),
    postReviewId: 2,
    description: "This is a sample review description JwtNYH3YRixYAUYsMTmW.",
    imageUrls: [],
  },
  {
    userName: "User48",
    hasUserImage: true,
    userImageUrl: "https://example.com/user_images/uKjaV62E.jpg",
    createdAt: new Date("2025-02-23T07:20:13"),
    postReviewId: 3,
    description: "This is a sample review description zDFpFn4cvrCFEnkey2qB.",
    imageUrls: ["https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"],
  },
  {
    userName: "User5",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2023-08-07T08:03:56"),
    postReviewId: 4,
    description: "This is a sample review description y0saKqZrvWOdW277N4V4.",
    imageUrls: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    ],
  },
  {
    userName: "User39",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2023-02-27T15:20:18"),
    postReviewId: 5,
    description: "This is a sample review description 6ZW3jHxaOGjr0zXN5mbs.",
    imageUrls: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    ],
  },
  {
    userName: "User4",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2024-03-21T00:42:22"),
    postReviewId: 6,
    description: "This is a sample review description fKo7q3ePteYRjNPwYE9y.",
    imageUrls: [],
  },
  {
    userName: "User65",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2024-10-10T09:23:13"),
    postReviewId: 7,
    description: "This is a sample review description 0FteUGQAOFa01HlFGjEO.",
    imageUrls: ["https://images.unsplash.com/photo-1504198453319-5ce911bafcde"],
  },
  {
    userName: "User80",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2024-07-26T08:35:33"),
    postReviewId: 8,
    description: "This is a sample review description u1YKirLKRWgjHCDz8J1K.",
    imageUrls: [],
  },
  {
    userName: "User66",
    hasUserImage: true,
    userImageUrl: "https://example.com/user_images/Y2oHktfb.jpg",
    createdAt: new Date("2024-07-12T07:33:59"),
    postReviewId: 9,
    description: "This is a sample review description lB05IQzKR6z53QmneH06.",
    imageUrls: [
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
      "https://images.unsplash.com/photo-1502764613149-7f1d229e230f",
    ],
  },
  {
    userName: "User25",
    hasUserImage: false,
    userImageUrl: "",
    createdAt: new Date("2025-02-03T20:45:05"),
    postReviewId: 10,
    description: "This is a sample review description DwbBy1ktjuYkdUCSLRUL.",
    imageUrls: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7",
      "https://images.unsplash.com/photo-1494522358652-1a1a1a1a1a1a",
    ],
  },
];

const Reviews = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;

  const { content } = await getReviews(art_id);
  console.log("content :>> ", content);

  return (
    <>
      {FAKE_REVIEWS.map((item, i) => (
        <ArtReview
          key={item.postReviewId}
          userName={item.userName}
          date={item.createdAt}
          images={item.imageUrls}
          desc={item.description}
        />
      ))}
      <BottomButton>리뷰 등록하기</BottomButton>
    </>
  );
};

export default Reviews;
