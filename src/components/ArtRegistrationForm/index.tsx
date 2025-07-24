"use client";
import { Art, ImageType } from "@/types/Art";
import { useState } from "react";
import Image from "next/image";
import ImageList from "../ImageList";
import { useRouter } from "next/navigation";
import Confirm from "../Popups/Confirm";

const MAX_IMAGE_NUM = 8;
const MAX_TITLE_NUM = 20;
const MAX_DESCRIPTION_LENGTH = 800;
const TEXT_IMAGE_RESTRICTION = `최소 1개 이상의 그림을 등록해주세요.`;
const TEXT_TITLE_RESTRICTION = `제목을 입력해주세요.`;
const TEXT_COST_FREE = `해당 그림체를 무료로 게시하시겠습니까?`;
const TEXT_DESC_RESTRICTION = `설명을 1자이상 입력해주세요.`;

// On create post
type CreatePostPayload = {
  title: string;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  imageIds: string[];
};

type ArtRegistrationFormProps = {
  art?: Art;
  confirmText?: string;
};

const ArtRegistrationForm = ({
  art,
  confirmText,
}: ArtRegistrationFormProps) => {
  const router = useRouter();

  // Form data
  const [title, setTitle] = useState<string>(art?.title || "");
  const [imageUrls, setImageUrls] = useState<ImageType[]>(art?.images || []);
  const [comCost, setComCost] = useState<number | undefined>(
    art?.commercialPrice ? art?.commercialPrice : undefined
  );
  const [nonComCost, setNonComCost] = useState<number | undefined>(
    art?.nonCommercialPrice ? art?.nonCommercialPrice : undefined
  );
  const [description, setDescription] = useState<string>(
    art?.description || ""
  );
  const [descriptionLength, setDescriptionLength] = useState<number>(
    art?.description.length || 0
  );

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > MAX_DESCRIPTION_LENGTH) return;
    setDescription(value);
    setDescriptionLength(value.length);
  };

  const onClickCreatePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (imageUrls.length < 1) {
      alert(TEXT_IMAGE_RESTRICTION);
      return;
    }
    if (!title) {
      alert(TEXT_TITLE_RESTRICTION);
      return;
    }
    if (description.length < 1) {
      alert(TEXT_DESC_RESTRICTION);
      return;
    }
    if (!comCost && !nonComCost) if (!confirm(TEXT_COST_FREE)) return;

    // const formData = new FormData();
    // imageUrls.forEach((item) => {
    //   formData.append("imageIds", item.imageId);
    // });
    // formData.append("title", title);
    // formData.append("description", description);
    // formData.append("commercialPrice", comCost || "0");
    // formData.append("nonCommercialPrice", comCost || "0");

    const payload: CreatePostPayload = {
      title: title,
      description: description,
      commercialPrice: comCost || 0,
      nonCommercialPrice: nonComCost || 0,
      imageIds: imageUrls.map((item) => item.imageId),
    };

    const requestUrl = art
      ? `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${art.id}`
      : `${process.env.NEXT_PUBLIC_API_HOST}/api/posts`;
    fetch(requestUrl, {
      method: art ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        const { status, isSuccess } = data;

        if (!isSuccess) {
          const { code, message, reason } = data;
          if (code == "C-001") {
            const prefix = art ? "수정할 수" : "만들 수";
            const alertMsg =
              `게시글을 ${prefix} 없었습니다. (${message})` +
              "\n" +
              "- " +
              reason.join("\n- ");
            alert(alertMsg);
          }
          return;
        }

        const { postId } = data.data;
        // Success routing
        if (status == 201 && isSuccess) {
          router.push("/art");
          router.replace(`/art/${postId}`);
          return;
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const onChangeImages = (images: ImageType[]) => {
    setImageUrls(images);
  };

  const onCostChange = (e, type: "COM" | "NONCOM") => {
    const value = Number(e.target.value);
    if (type === "COM") {
      if (value <= 0) {
        // Shows placeholder
        setComCost(undefined);
        e.target.value = undefined;
      } else setComCost(value);
    } else {
      if (value <= 0) {
        // Shows placeholder
        setNonComCost(undefined);
        e.target.value = undefined;
      } else setNonComCost(value);
    }
  };

  return (
    <>
      {/* 게시글 작성 타이틀 */}
      {/* 이미지 업로드 영역 */}
      <ImageList
        items={imageUrls}
        enableEdit={true}
        onChange={onChangeImages}
      />

      {/* 제목 입력란 */}
      <div className="mt-6">
        <label className="block text-md font-semibold mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black px-4 py-3 text-sm outline-none placeholder-gray-400"
          placeholder="제목을 입력해주세요"
        />
        <p className="text-right font-[--color-gray-4] text-xs mt-1">
          {title.length}/{MAX_TITLE_NUM}
        </p>
      </div>

      {/* 가격 입력란 */}
      <div className="mt-4">
        <label className="block text-md font-semibold mb-2">가격</label>
        <div className="flex flex-row items-center gap-2">
          <div className="relative basis-1/2">
            <input
              type="number"
              value={comCost}
              onChange={(e) => onCostChange(e, "COM")}
              className="w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black pl-10 py-4 text-sm outline-none placeholder-gray-400"
              placeholder="상업용 가격"
            />
            <Image
              src="/circle-letter-c.svg"
              alt="commercial cost"
              width={24}
              height={24}
              className="absolute top-4 left-2"
            />
          </div>
          <div className="relative basis-1/2">
            <input
              type="number"
              value={nonComCost}
              onChange={(e) => {
                onCostChange(e, "NONCOM");
              }}
              className="w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black pl-10 py-4 text-sm outline-none placeholder-gray-400"
              placeholder="비상업용 가격"
            />
            <Image
              src="/circle-letter-c.svg"
              alt="non-commercial cost"
              width={24}
              height={24}
              className="absolute top-4 left-2"
            />
          </div>
        </div>
      </div>

      {/* 그림체 소개 */}
      <div className="mt-6">
        <label className="block text-md font-semibold mb-2">설명</label>
        <div className="relative rounded-lg bg-[#EDEEEF] px-4 py-4 text-sm text-gray-600 flex flex-col min-h-[180px]">
          <textarea
            value={description}
            onChange={onChangeDescription}
            className="h-full resize-none overflow-y-auto min-h-[180px]"
            placeholder={
              "무엇을 만들고자 하나요?" +
              "\n" +
              "- 만들고 싶은 대상이나 해결하고 싶은 문제를 적어주세요." +
              "\n" +
              "\n" +
              "한 줄로 소개한다면?" +
              "\n" +
              "- 프로젝트 내용을 짧고 명확하게 써주세요." +
              "\n" +
              "\n" +
              "왜 의미 있나요?" +
              "\n" +
              "- 만든 이유나 필요성을 간단히 적어주세요."
            }
          />
        </div>
        <div className="text-right text-xs text-[--color-gray-4] mt-2">
          {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
        </div>
      </div>

      {/* 작성 완료 버튼 */}
      <button
        className="fixed bottom-16 w-[calc(384px-22px)] h-12 rounded-lg bg-[#3E3E3E] text-white text-base"
        onClick={onClickCreatePost}
      >
        <p className="font-bold">{confirmText ? confirmText : "작성 완료"}</p>
      </button>
    </>
  );
};

export default ArtRegistrationForm;
