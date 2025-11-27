"use client";

import { RESPONSE_BODY_TYPE } from "@/APIs/ai/images/my-generated";
import PrimaryButton from "@/components/Button/PrimaryButton";
import ContentViewer from "@/components/ContentViewer";
import { SUGGEST_SEARCH_POSTS } from "@/components/ContentViewer/placeholders";
import { Popup } from "@/components/Popups";
import { Art_thumbnail, GeneratedImageType } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Content = ({ content }: RESPONSE_BODY_TYPE) => {
  // Refactoring my-generated images to type `Art_thumbnail`
  const safeArts: Art_thumbnail[] = content.map(
    ({ imageId, imageUrl, ...rest }) => ({
      ...rest,
      imageId: undefined, // Remove property
      imageUrl: undefined, // Remove property
      images: [{ imageId, imageUrl }],
    })
  );

  // Popup states: accept either Art_thumbnail or GeneratedImageType
  const [selectedArt, setSelectedArt] = useState<
    Art_thumbnail | GeneratedImageType | null
  >(null);
  useEffect(() => {}, [selectedArt]);

  // Type guard to detect GeneratedImageType
  const isGenerated = (
    art: Art_thumbnail | GeneratedImageType
  ): art is GeneratedImageType => {
    return (art as GeneratedImageType).imageUrl !== undefined;
  };

  // Derived safe accessors for fields used below
  const derivedImageUrl =
    selectedArt &&
    (isGenerated(selectedArt)
      ? selectedArt.imageUrl
      : selectedArt.images?.[0]?.imageUrl);
  const derivedImageId =
    selectedArt &&
    (isGenerated(selectedArt)
      ? selectedArt.imageId
      : selectedArt.images?.[0]?.imageId);
  const derivedPostId =
    selectedArt &&
    (isGenerated(selectedArt) ? selectedArt.postId : selectedArt.postId);
  const derivedFromOriginImage =
    selectedArt &&
    (isGenerated(selectedArt) ? selectedArt.fromOriginImage : false);

  // URL Parameterize
  const urlSafeImageUrl =
    derivedImageUrl && encodeURIComponent(derivedImageUrl);

  return (
    <>
      {selectedArt && (
        <Popup onClick={() => setSelectedArt(null)}>
          <>
            {derivedImageUrl && (
              <Image
                src={derivedImageUrl}
                alt={derivedImageUrl}
                layout="responsive"
                className="mb-4 rounded-xl"
                width={200}
                height={200}
              />
            )}
            {!derivedFromOriginImage && (
              <p className="text-(--color-gray-4) mb-4 text-left">
                원작자의 그림체가 적용되지 않아 2차 창작물로 등록할 수 없습니다.
                <Link
                  href={`/art/${derivedPostId}`}
                  className="block underline"
                >
                  원작 그림으로 이동하기
                </Link>
              </p>
            )}
            <Link
              href={`/art/regist/${derivedImageId}?imageUrl=${urlSafeImageUrl}`}
            >
              <PrimaryButton
                text="2차 창작물 등록하기"
                disabled={!derivedFromOriginImage}
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
        onClickPost={(post: Art_thumbnail | GeneratedImageType) =>
          setSelectedArt(post)
        }
      >
        <SUGGEST_SEARCH_POSTS />
      </ContentViewer>
    </>
  );
};

export default Content;
