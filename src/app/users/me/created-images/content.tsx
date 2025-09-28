"use client";

import { RESPONSE_BODY_TYPE } from "@/APIs/ai/images/my-generated";
import ContentViewer from "@/components/ContentViewer";

const Content = ({ content, page, size, hasNext }: RESPONSE_BODY_TYPE) => {
  const safeArts = content.map(({ postId, imageId, imageUrl }) => ({
    postId,
    images: [{ imageId, imageUrl }],
  }));
  return (
    <>
      <ContentViewer grid={2} arts={safeArts} showTabs={false} mode="POPUP" />
    </>
  );
};

export default Content;
