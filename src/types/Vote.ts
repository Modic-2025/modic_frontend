export type Vote = {
  voteId: number;
  originalImageUrl: string;
  derivedImageUrl: string;
  approveWeight: number;
  denyWeight: number;
  totalWeight: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
};

export type VoteDecisions = "APPROVE" | "DENY";
