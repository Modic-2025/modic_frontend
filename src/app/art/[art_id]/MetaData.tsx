"use client";
import DeleteArt from "@/APIs/Art/DeleteArt";
import OverlayOption, { Option } from "@/components/Popups/OptionButtons";
import Confirm from "@/components/Popups/Confirm";
import UserInfo from "@/components/UserInfo";
import { Art } from "@/types/Art";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ALERT_401_TEXT_DESC,
  ALERT_401_TEXT_TITLE,
  ALERT_404_TEXT_DESC,
  ALERT_404_TEXT_TITLE,
  ALERT_500_TEXT_DESC,
  ALERT_500_TEXT_TITLE,
  LikeArt,
} from "@/APIs/Art/Like";
import Fail from "@/components/Popups/Fail";

const MetaData = ({
  art,
  isAuthor,
  isLogined,
}: {
  art: Art;
  isAuthor: boolean;
  isLogined: boolean;
}) => {
  const [artLike, setArtLike] = useState<boolean>(art.isLikedByCurrentUser);
  const [showOption, setShowOption] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [failTitle, setFailTitle] = useState<string>("");
  const [failDesc, setFailDesc] = useState<string>("");
  const router = useRouter();

  // On delete
  const onClickArtDelete = async () => {
    setShowConfirm(true);
  };

  // On confirm ok
  const onClickConfirmOk = async () => {
    const isFailed = await DeleteArt(art.postId);
    if (!isFailed) router.back();
  };

  // On confirm cancel
  const onClickConfirmCancel = () => {
    setShowOption(false);
    setShowConfirm(false);
  };

  // UI
  const onCloseOverlayOption = () => {
    setShowOption(false);
  };

  const onClickLikeButton = async () => {
    const response = await LikeArt(art.postId);
    if (typeof response == "boolean" && response) {
      setArtLike(!artLike);
      return;
    }

    // Fail status cases
    if (typeof response == "number") {
      switch (response) {
        case 401:
          setFailTitle(ALERT_401_TEXT_TITLE);
          setFailDesc(ALERT_401_TEXT_DESC);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          break;
        case 404:
          setFailTitle(ALERT_404_TEXT_TITLE);
          setFailDesc(ALERT_404_TEXT_DESC);
          setTimeout(() => {
            router.push("/art");
          }, 3000);
          break;
        default:
          // case 500:
          setFailTitle(ALERT_500_TEXT_TITLE);
          setFailDesc(ALERT_500_TEXT_DESC);
      }
      setShowFail(true);
    }
  };

  return (
    <>
      {showFail && (
        <Fail
          title={failTitle}
          desc={failDesc}
          onCancel={() => setShowFail(false)}
        />
      )}
      {showOption && (
        <OverlayOption onClose={onCloseOverlayOption}>
          <Option href={`/art/edit/${art.postId}`}>수정</Option>
          <Option onClick={onClickArtDelete} type="warn">
            삭제
          </Option>
        </OverlayOption>
      )}
      {showConfirm && (
        <Confirm
          title="게시글을 정말 삭제하시겠어요?"
          desc="한 번 삭제하면 되돌릴 수 없습니다."
          confirmText="네, 삭제할게요"
          noBg={true}
          onConfirm={onClickConfirmOk}
          onCancel={onClickConfirmCancel}
        />
      )}
      <UserInfo
        title={art.userName}
        desc={art.userEmail}
        href={`/users/${art.userId}`}
      />
      {/* <AuthorProfile art={art} /> */}
      {isAuthor ? (
        <div
          onClick={() => setShowOption(true)}
          className="flex h-[24px] cursor-pointer basis-1/10"
        >
          <Image
            src="/icon-grey-dotted.svg"
            alt="option"
            className="m-auto"
            width={18}
            height={18}
          />
        </div>
      ) : (
        <div className="flex basis-5/10 ml-auto text-center text-[12px]">
          <div className="ml-auto">
            <p className="font-bold"> {art.commercialPrice}코인 </p>
            <p className="text-[#989898]"> 상업적 </p>
          </div>
          <div className="ml-2">
            <p className="font-bold"> {art.nonCommercialPrice}코인 </p>
            <p className="text-[#989898]"> 비상업적 </p>
          </div>
          {isLogined && (
            <button className="ml-4 cursor-pointer" onClick={onClickLikeButton}>
              <Image
                src={artLike ? "/Heart_filled.svg" : "/Heart.svg"}
                alt="like"
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default MetaData;
