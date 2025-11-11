"use client";

import { RESPONSE_BODY_TYPE } from "@/APIs/ai/images/my-generated";
import PrimaryButton from "@/components/Button/PrimaryButton";
import ContentViewer from "@/components/ContentViewer";
import { Popup } from "@/components/Popups";
import { Art, Art_thumbnail } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Content = ({ content, page, size, hasNext }: RESPONSE_BODY_TYPE) => {
  // Refactoring my-generated images to type `Art_thumbnail`
  const safeArts: Art_thumbnail[] = content.map(
    ({ imageId, imageUrl, ...rest }) => ({
      ...rest,
      imageId: undefined, // Remove property
      imageUrl: undefined, // Remove property
      images: [{ imageId, imageUrl }],
    })
  );

  // Popup states
  const [selectedArt, setSelectedArt] = useState<Art_thumbnail | null>(null);

  // URL Parameterize
  const urlSafeImageUrl =
    selectedArt && encodeURIComponent(selectedArt.images[0].imageUrl);

  return (
    <>
      {selectedArt && (
        <Popup onClick={() => setSelectedArt(null)}>
          <>
            <Image
              src={selectedArt.images[0].imageUrl}
              alt={selectedArt.images[0].imageUrl}
              layout="responsive"
              className="mb-4 rounded-xl"
              width={200}
              height={200}
            />
            {!selectedArt.fromOriginImage && (
              <p className="text-(--color-gray-4) mb-4 text-left">
                원작자의 그림체가 적용되지 않아 2차 창작물로 등록할 수 없습니다.
                <Link
                  href={`/art/${selectedArt.postId}`}
                  className="block underline"
                >
                  원작 그림으로 이동하기
                </Link>
              </p>
            )}
            <Link
              href={`/art/regist/${selectedArt.images[0].imageId}?imageUrl=${urlSafeImageUrl}`}
            >
              <PrimaryButton
                text="2차 창작물 등록하기"
                disabled={!selectedArt.fromOriginImage}
              />
            </Link>
          </>
        </Popup>
      )}
      <ContentViewer
        grid={2}
        arts={safeArts}
        showTabs={false}
        mode="DERIVED"
        onClickPost={(post: Art_thumbnail) => setSelectedArt(post)}
      />
    </>
  );
};

export default Content;
