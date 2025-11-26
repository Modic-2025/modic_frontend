"use client";
import MDEditor from "@uiw/react-md-editor";
import { Art, ImageType } from "@/types/Art";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import ImageList from "../ImageList";
import { useRouter } from "next/navigation";
import InputSet from "../Inputs/InputSet";
import { createDerivedPost } from "@/APIs/ai/derived-posts";
import { APIFailureMsg } from "@/APIs";
import createPost from "@/APIs/Art/Create";
import updatePost from "@/APIs/Art/Update";
import ToolTip from "../ToolTip";

const MAX_TITLE_NUM = 20;
const MAX_DESCRIPTION_LENGTH = 800;
const TEXT_IMAGE_RESTRICTION = `최소 1개 이상의 그림을 등록해주세요.`;
const TEXT_TITLE_RESTRICTION = `제목을 입력해주세요.`;
const TEXT_COST_FREE = `해당 그림체를 무료로 게시하시겠습니까?`;
const TEXT_DESC_RESTRICTION = `설명을 1자이상 입력해주세요.`;

type ArtRegistrationFormProps = {
  art?: Art | Partial<Art>;
  confirmText?: string;
  isDerived?: boolean;
};

const ArtRegistrationForm = ({
  art,
  confirmText,
  isDerived = false,
}: ArtRegistrationFormProps) => {
  const router = useRouter();

  const isEditingMode = Boolean(art);

  // Form data
  const [title, setTitle] = useState<string>(art?.title || "");
  const [description, setDescription] = useState<string>(
    art?.description || ""
  );
  const [images, setImageUrls] = useState<ImageType[]>(art?.images || []);
  const [comCost, setComCost] = useState<number | undefined>(
    art?.commercialPrice ? art?.commercialPrice : undefined
  );
  const [nonComCost, setNonComCost] = useState<number | undefined>(
    art?.nonCommercialPrice ? art?.nonCommercialPrice : undefined
  );
  const [ticketCost, setTicketCost] = useState<number | undefined>(
    art?.nonCommercialPrice ? art?.nonCommercialPrice : undefined
  );

  const onClickCreatePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (images.length < 1) {
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

    // Confirmation of no-cost post
    if (!comCost && !nonComCost) if (!confirm(TEXT_COST_FREE)) return;

    if (isDerived) {
      handleCreateDrvPost();
      return;
    }

    if (isEditingMode) {
      if (art && typeof art.postId === "number") {
        handleEditPost(art.postId);
        return;
      }
      alert(
        "수정하고자 하는 게시글의 정보를 찾을 수 없습니다. 새로고침후 다시 시도해주세요 (art or art.posttId is not exist)"
      );
      return;
    }

    handleCreatePost();
  };

  // 게시글 생성
  const handleCreatePost = async () => {
    const response: APIFailureMsg | number = await createPost(
      title,
      description,
      10,
      images.map((item) => item.imageId),
      comCost,
      nonComCost
    );

    if (typeof response !== "number") {
      const { title } = response;
      alert(title);
      return;
    }

    const safePostId = response;
    // Success routing
    router.push("/art");
    router.replace(`/art/${safePostId}`);
  };

  // 게시글 수정
  const handleEditPost = async (id: number) => {
    const response: boolean | APIFailureMsg = await updatePost(
      id,
      title,
      description,
      1,
      images.map((item) => item.imageId),
      comCost,
      nonComCost
    );

    if (typeof response !== "boolean") {
      const { title } = response;
      alert(title);
      return;
    }

    router.back();
  };

  // 2차 창작 게시글 생성
  const handleCreateDrvPost = async () => {
    // Derived post cannot set
    const response: number | APIFailureMsg = await createDerivedPost(
      images[0].imageId,
      title,
      description,
      comCost || 0,
      nonComCost || 0,
      ticketCost || 1
    );

    // failure
    if (typeof response !== "number") {
      const { code, title } = response;
      switch (code) {
        case 400:
          alert(`${title} (${code})`);
          break;
        case 403: // no access to ai created image
          alert("해당 AI 이미지에 대한 권한이 없습니다.");
          break;
        case 404: // cannot find ai created image
          alert("해당 AI 이미지를 찾을 수 없습니다.");
          break;
        case 409: // already registrated
          alert("이미 등록된 AI 이미지 입니다.");
          break;
        default:
          alert(`서버에서 에러가 발생했습니다. (${code})`);
      }
      return;
    }

    // Success
    if (typeof response === "number") {
      router.push(`/art/${response}`);
    }
    return;
  };

  const onChangeImages = (images: ImageType[]) => {
    setImageUrls(images);
  };

  const onCostChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "COM" | "NONCOM" | "TICKET"
  ) => {
    switch (type) {
      case "COM":
        handleComCost(e);
        break;
      case "NONCOM":
        handleNonComCost(e);
        break;
      case "TICKET":
        handleTicketCost(e);
        break;
      default: // ERROR: no target
        alert("비용을 갱신할 수 없었습니다. 새로고침후 다시 시도해주세요");
    }
  };

  // Handling costs
  const handleComCost = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numberValue = Number(value);
    if (numberValue < 0 || !value) {
      // Shows placeholder
      setComCost(undefined);
      e.target.value = "";
    } else setComCost(numberValue);
  };
  const handleNonComCost = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numberValue = Number(value);
    if (numberValue < 0 || !value) {
      // Shows placeholder
      setNonComCost(undefined);
      e.target.value = "";
    } else setNonComCost(numberValue);
  };
  const handleTicketCost = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numberValue = Number(value);
    if (numberValue < 0 || !value) {
      // Shows placeholder
      setTicketCost(undefined);
      e.target.value = "";
    } else setTicketCost(numberValue);
  };

  // only-one image allowed in regist derived post
  const imageListMode = isDerived ? "READ-ONLY" : "EDIT";

  return (
    <>
      {/* 이미지 업로드 영역 */}
      <ImageList
        items={images}
        mode={imageListMode}
        onChange={onChangeImages}
      />

      {/* 제목 입력란 */}
      <div className="mt-6">
        <InputSet
          title={"제목"}
          inputLayout="NORMAL"
          value={title}
          onChange={(e) => {
            const { value } = e.target;
            if (value.length > MAX_TITLE_NUM) return;
            setTitle(e.target.value);
          }}
          placeholder="제목을 입력해주세요"
        />
        <p className="text-right font-[--color-gray-4] text-xs mt-1">
          {title.length}/{MAX_TITLE_NUM}
        </p>
      </div>

      {/* 가격 입력란 */}
      <div className="mt-4">
        <label className="block text-md font-semibold mb-2">비용</label>
        <div className="flex flex-row items-center gap-2">
          <div className="relative basis-1/3">
            <input
              type="number"
              value={comCost}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onCostChange(e, "COM")
              }
              className="w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black pl-10 py-4 text-sm outline-none placeholder-gray-400"
              placeholder="상업용"
            />
            <ToolTip text="상업용도로 사용될 때의 코인 개수">
              <Image
                src="/copyright.svg"
                alt="commercial cost"
                width={24}
                height={24}
                className="absolute top-4 left-2"
              />
            </ToolTip>
          </div>
          <div className="relative basis-1/3">
            <input
              type="number"
              value={nonComCost}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onCostChange(e, "NONCOM");
              }}
              className="w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black pl-10 py-4 text-sm outline-none placeholder-gray-400"
              placeholder="비상업용"
            />
            <ToolTip text="비상업용도로 사용될 때의 코인 개수">
              <Image
                src="/copyright-off.svg"
                alt="non-commercial cost"
                width={24}
                height={24}
                className="absolute top-4 left-2"
              />
            </ToolTip>
          </div>
          <div className="relative basis-1/3">
            <input
              type="number"
              value={ticketCost}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onCostChange(e, "TICKET");
              }}
              className="relative w-full rounded-lg bg-[#EDEEEF] border-none focus:ring-2 focus:ring-black pl-10 py-4 text-sm outline-none placeholder-gray-400"
              placeholder="티켓"
            />
            <ToolTip text="AI 편집 권한 20개를 구매하기위한 티켓의 개수">
              <Image
                src="/ticket-gray-4.svg"
                alt="non-commercial cost"
                width={24}
                height={24}
                className="absolute top-4 left-2"
              />
            </ToolTip>
          </div>
        </div>
      </div>

      {/* 그림체 소개 */}
      <div className="mt-6">
        <label className="block text-md font-semibold mb-2">설명</label>

        <MDEditor
          value={description}
          onChange={(value?: string) => {
            if (!value) {
              setDescription("");
              return;
            }
            if (value.length > MAX_DESCRIPTION_LENGTH) return;
            setDescription(value);
          }}
        />
        <div className="text-right text-xs text-[--color-gray-4] mt-2">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
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
