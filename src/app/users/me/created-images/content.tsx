"use client";

import { RESPONSE_BODY_TYPE } from "@/APIs/ai/images/my-generated";
import ContentViewer from "@/components/ContentViewer";
import { Art, Art_thumbnail } from "@/types/Art";

const Content = ({ content, page, size, hasNext }: RESPONSE_BODY_TYPE) => {
  const safeArts: Art_thumbnail[] = content.map(
    ({ postId, imageId, imageUrl }) => ({
      postId,
      images: [{ imageId, imageUrl }],
    })
  );
  return (
    <>
      <ContentViewer grid={2} arts={safeArts} showTabs={false} mode="POPUP" />
    </>
  );
};

export default Content;
