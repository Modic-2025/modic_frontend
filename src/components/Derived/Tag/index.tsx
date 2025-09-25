type StatusType = "PENDING" | "APPROVED" | "DECLINED";
const STATUS_PENDING = "투표 진행중";
const STATUS_APPROVED = "2차 창작물";
const STATUS_DECLINED = "2차 창작물 반려됨";
const COMMON_CLASSNAME =
  "inline-block px-2 py-1 rounded-full text-sm font-bold mr-1";
const DerivedArtTag = ({ status }: { status: StatusType }) => {
  let tagText = "";
  let tagClassName = `${COMMON_CLASSNAME}`;

  let cn = "";
  switch (status) {
    case "PENDING":
      tagText = STATUS_PENDING;
      cn = "bg-(--color-gray-1)";
      break;
    case "APPROVED":
      tagText = STATUS_APPROVED;
      cn = "bg-[#E4EDFF]";
      break;
    case "DECLINED":
      tagText = STATUS_DECLINED;
      cn = "bg-[#FFD8C6]";
      break;
    default:
      tagText = status;
  }
  tagClassName += ` ${cn}`;

  return <div className={tagClassName}>{tagText}</div>;
};

export default DerivedArtTag;
