import { PostStatus } from "@/types/Art";

type StatusType = PostStatus;
const DERIVED_PENDING = "투표 진행중";
const DERIVED_APPROVED = "2차 창작물";
const DERIVED_REJECTED = "2차 창작물 반려됨";
const COMMON_CLASSNAME =
  "inline-block px-2 py-1 rounded-full text-sm font-bold mr-1";
const DerivedArtTag = ({ status }: { status: StatusType }) => {
  let tagText = "";
  let tagClassName = `${COMMON_CLASSNAME}`;

  let cn = "";
  switch (status) {
    case "DERIVED_PENDING":
      tagText = DERIVED_PENDING;
      cn = "bg-(--color-gray-1)";
      break;
    case "DERIVED_APPROVED":
      tagText = DERIVED_APPROVED;
      cn = "bg-[#E4EDFF]";
      break;
    case "DERIVED_REJECTED":
      tagText = DERIVED_REJECTED;
      cn = "bg-[#FFD8C6]";
      break;
    default:
      tagText = status;
  }
  tagClassName += ` ${cn}`;

  return <div className={tagClassName}>{tagText}</div>;
};

export default DerivedArtTag;
