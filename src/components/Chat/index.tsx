"use client";
import { APIFailureMsg } from "@/APIs";
import getAiUrl from "@/APIs/ai/images/requests/get-url";
import _fetch from "@/APIs/fetcher/ClientSide";
import UploadImage from "@/APIs/ImageUploader";
import useArt from "@/APIs/useArt";
import generateImage from "@/APIs/useGenerateImage";
import useRemainGens from "@/hooks/UseRemainGens";
import { Art } from "@/types/Art";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR, { SWRResponse, useSWRConfig } from "swr";
import ClickableImage from "../ClickableImage";
import Confirm from "../Popups/Confirm";
import buyPermissionWithCoin from "@/APIs/ai/image-permissions/buy-with-coin";
import Error from "next/error";
import UseCoins from "@/hooks/UseCoins";
import Fail from "../Popups/Fail";
import { fetchEventSource } from "@microsoft/fetch-event-source";

// 임시로 로딩 메시지 판별의 기준
const NOW_LOADING_MSG = "이미지 생성중...";

// 한 번에 충전될 이미지 편집 권한 개수 (추후 백엔드에서 줘야 함)
const APPLY_PERMISSION_COUNT_AT_ONCE = 20;

type ChatType = {
  type: 0 | 1; // 0: opponent, 1: me
  text: string;
  image?: string;
  isLoading?: boolean;
};

// Pooling state
type PoolingStates = "PENDING" | "DONE" | "FAILED";

const Chat = ({ artId }: { artId: number }) => {
  let safeArtId: number = -1;
  try {
    safeArtId = Number(artId);
  } catch (e) {
    console.error(`artId: ${artId}를 Number 형으로 변환하지 못하였습니다.`);
  }
  // Component UI state
  const [isUIInitialized, setInit] = useState<boolean>(false);
  const {
    data: art,
    error,
    isLoading,
  }: SWRResponse<Art, Error> = useArt(safeArtId);

  /**
   * UI states
   */
  const [chatDisabled, setChatDisabled] = useState<boolean>(true);
  const [showConfirmWindow, setShowConfirmWindow] = useState<boolean>(false);
  const [showBuyWindow, setShowBuyWindow] = useState<boolean>(false);
  // Window that failed to buy permissions
  const [showBuyFailWindow, setShowBuyFailWindow] = useState<boolean>(false);
  const [buyFailTitle, setBuyFailTitle] = useState<string>("");
  const [confirmState, setConfirmState] = useState<boolean>(false);
  const [chatStack, setChatStack] = useState<Array<ChatType>>([]);
  const {
    data: remainingGen,
    error: errorRemainingGen,
    isLoading: isLoadingRemainingGen,
  } = useRemainGens(Number(safeArtId));
  const { data: coins, error: error_coins } = UseCoins();

  const { mutate } = useSWRConfig();

  // Refs
  const chatRef = useRef<HTMLDivElement>(null);

  // For pooling
  const [aiRequestId, setAiRequestId] = useState<string>("");
  const {
    data: aiStatusResponse,
    error: error_aiStatus,
    isLoading: isLoading_aiStatus,
  } = useSWR(
    aiRequestId
      ? [
          `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/requests/${aiRequestId}/status`,
          aiRequestId,
        ]
      : null,
    ([url, requestId]: [string, string]) => {
      return requestId
        ? _fetch(url, true).then(async (response) => response.json())
        : null;
    },
    {
      refreshInterval: 1000,
      onSuccess: (data) => {
        if (data && data.data.status === "DONE") {
          getAiGeneratedImage(aiRequestId);
          setAiRequestId("");
        }
      },
    }
  );

  // Stop pooling when aiStatus === "DONE"
  useEffect(() => {
    if (aiStatusResponse && aiStatusResponse.data.status === "DONE") {
      getAiGeneratedImage(aiRequestId);
      setAiRequestId("");
    }
  }, [aiStatusResponse, aiRequestId]);

  const getAiGeneratedImage = async (requestId: string) => {
    const imageUrl: string | APIFailureMsg = await getAiUrl(requestId);
    setChatStack((prev) => [
      ...prev.filter((item) => item.text !== NOW_LOADING_MSG),
      {
        type: 0 as 0,
        // text: "요청하신 이미지를 그림체기반으로 재생성하였습니다.",
        image: imageUrl,
      } as ChatType,
    ]);
  };

  // Form data
  const [inputText, setInputText] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputImage, setInputImage] = useState<string>("");

  /**
   * Events
   */
  // key-down on input
  const textInputKeydownCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block
    if (inputText.trim() === "") {
      return;
    }
    if (e.key === "Enter") {
      setChatStack((prev) => [
        ...prev,
        { type: 1, text: inputText, image: inputImage },
      ]);
      setInputText("");
      setInputImage("");
      // setChatDisabled(true);
    }
  };

  // on-click event on buy permission window
  const onClickBuy = async () => {
    const response = await buyPermissionWithCoin(safeArtId);
    setShowBuyWindow(false);
    // On success
    if (typeof response === "boolean" && response) {
      mutate([`remaining-generations`, art?.postId]);
      inputFile && readFileAndSetImage(inputFile); // read file and run the process
      return;
    }
    const { title } = response;
    setShowBuyFailWindow(true);
    setBuyFailTitle(title);
  };

  /**
   * UI controls
   */
  // Scroll chat-stack to bottom-end
  const chatScrollToEnd = () => {
    const { current } = chatRef;
    if (current) {
      setTimeout(() => {
        current.scrollTo({
          top: current.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  };

  /**
   * Effects
   */
  // Scroll to end when chat stack changed
  useEffect(() => {
    if (chatStack) {
      chatScrollToEnd();
    }
  }, [chatStack]);

  // Initialize UI
  useEffect(() => {
    if (art && !isUIInitialized) {
      const { images, postId } = art;
      setChatStack([
        {
          type: 0,
          image: images[0].imageUrl,
          text: "이 그림체로 어떤 작품을 만들어볼까요?",
        },
      ]);

      setInit(true); // Set flag
    }
  }, [art]);

  useEffect(() => {
    if (error) console.error("ERROR OCCURED: ", error);
  }, [error]);

  /**
   * PROCESSING INPUT FILE
   */
  // 1: Check remaining permissions & Read file
  useEffect(() => {
    if (remainingGen <= 0) {
      setShowBuyWindow(true);
      return;
    }
    if (inputFile) {
      readFileAndSetImage(inputFile);
    }
  }, [inputFile]);

  // input file을 읽고, inputImage state에 이미지를 저장합니다.
  const readFileAndSetImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 2: Input image changed
  useEffect(() => {
    if (inputImage) {
      setShowConfirmWindow(true);
    }
  }, [inputImage]);

  // 3: On confirm window close
  useEffect(() => {
    if (!showConfirmWindow) {
      setInputImage("");
      setInputFile(null);
      setChatDisabled(false);
    }
  }, [showConfirmWindow]);

  // 4: Upload image for ai works
  useEffect(() => {
    if (confirmState && inputFile) {
      UploadImage(
        inputFile,
        async (r, e) => {
          if (e) {
            console.error("Error occured in image upload");
            return;
          }
          setChatStack((prev) => [
            ...prev,
            { type: 1, text: inputText, image: r[0] },
            {
              type: 0,
              text: NOW_LOADING_MSG,
              isLoading: true,
            },
          ]);
          setInputText("");
          setInputImage("");
          setChatDisabled(true);
          const responseGenerateImage = await (
            await generateImage(
              inputFile.name,
              r[1], // Uploaded image path
              safeArtId,
              false
            )
          ).json();
          const { status, isSuccess, data } = responseGenerateImage;
          if (!isSuccess) {
            console.error("ERROR");
            setChatStack((prev) => [
              ...prev.filter((item) => item.text !== NOW_LOADING_MSG),
              {
                type: 0 as 0,
                text: `생성중 에러가 발생하였습니다. 잠시 후 다시 시도해주세요 (${status})`,
              } as ChatType,
            ]);
          }
          // Starts pooling
          if (status === 201) {
            const { requestId } = data;
            // setAiRequestId(requestId);
            const token = localStorage.getItem("accessToken");
            await fetchEventSource(
              `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/sse/${requestId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                async onmessage(e) {
                  const { data } = e;
                  const { imageUrl } = await JSON.parse(data);
                  setChatStack((prev) => [
                    ...prev.filter((item) => item.text !== NOW_LOADING_MSG),
                    {
                      type: 0 as 0,
                      // text: "요청하신 이미지를 그림체기반으로 재생성하였습니다.",
                      image: imageUrl,
                    } as ChatType,
                  ]);
                },
              }
            );
          }

          setConfirmState(false);
        },
        "AI_REQUEST"
      );
    }
  }, [confirmState]);

  return (
    <>
      {/* <div className="absolute rounded-full z-1 py-2 px-4 bg-(--color-main) text-white shadow-lg right-4">
        <p className="flex font-bold">
          <Image
            src="/icon-image-white.svg"
            alt="잔여 횟수: "
            className="mr-1"
            width={24}
            height={24}
          />
          {remainingGen}번
        </p>
      </div> */}
      <div
        className="absolute width-full height-full overflow-y-auto p-4 pb-16 inset-0"
        ref={chatRef}
      >
        {/* Buy permissions window */}
        {showBuyWindow && (
          <Confirm
            title={`코인 ${art?.nonCommercialPrice}개로 그림체 변환 20번을 구매 하시겠습니까?`}
            desc={`현재 보유한 코인: ${coins}개`}
            onConfirm={onClickBuy}
            onCancel={() => setShowBuyWindow(false)}
          />
        )}

        {/* Failed to buy permissions window */}
        {showBuyFailWindow && (
          <Fail
            title={buyFailTitle}
            onCancel={() => {
              setShowBuyFailWindow(false);
            }}
          />
        )}

        {/* Confirm window */}
        {showConfirmWindow && (
          <div className="fixed flex items-center justify-center align-text inset-0 w-full h-full bg-white/60">
            <div className="flex items-center flex-col text-center">
              <Image
                src={inputImage}
                alt={inputImage}
                layout="raw"
                width={200}
                height={200}
                className="rounded-2xl shadow-lg mb-4 max-w-[30vw] max-h-[30vh]"
                // unoptimized
              />
              <h1 className="font-bold">선택하신 사진으로 계속 진행할까요?</h1>
              <h1 className="font-bold mb-4">진행 시 N코인이 차감됩니다.</h1>
              <div className="flex flex-row gap-6">
                <button
                  className="cursor-pointer border-2 p-2 rounded-md bg-white border-[#E9E9E9]"
                  onClick={() => {
                    setConfirmState(false);
                    setShowConfirmWindow(false);
                  }}
                >
                  다시 선택할게요
                </button>
                <button
                  className="cursor-pointer bg-[#585858] p-2 rounded-md text-white"
                  onClick={() => {
                    setConfirmState(true);
                    setShowConfirmWindow(false);
                  }}
                >
                  <p className="font-bold">네, 진행할게요</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat history */}
        {chatStack.map((chat, index) =>
          chat.type === 0 ? (
            <div
              key={index}
              className={`opponent flex flex-row items-end gap-2 mb-4 ${
                chat.isLoading && "opacity-60"
              }`}
            >
              <div className="profile basis-1/10">
                <Image
                  src="/opponent-profile-icon.svg"
                  alt="opponent"
                  className="relative bottom-0"
                  width={48}
                  height={48}
                />
              </div>
              <div className="chat-area basis-9/10">
                {chat.image && (
                  <ClickableImage
                    src={chat.image}
                    alt="origin_image"
                    // layout="intrinsic"
                    width={240}
                    height={180}
                    className="mb-4 shadow-lg rounded-2xl cursor-grab"
                  />
                )}
                {chat.text && (
                  <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-bl-none">
                    {chat.text}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div key={index} className="me flex justify-end gap-2 mb-4">
              <div className="chat-area">
                {chat.image && (
                  <ClickableImage
                    src={chat.image}
                    alt="origin_image"
                    // layout="intrinsic"
                    width={240}
                    height={180}
                    className="mb-4 shadow-lg rounded-2xl cursor-grab"
                  />
                )}
                {chat.text && (
                  <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-bl-none">
                    {chat.text}
                  </p>
                )}
              </div>
            </div>
          )
        )}

        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-sm px-4 h-12 gap-2">
          <div className="flex flex-row px-4 h-full bg-white rounded-full shadow-2xl">
            {" "}
            {/* wraper */}
            <input
              className="w-full h-full inset-0 flex-9/10"
              placeholder={
                remainingGen <= 0
                  ? "그림체를 변환하기 위해 구매가 필요해요"
                  : `앞으로 ${remainingGen}번 그림체 변환 가능합니다!`
              }
              value={inputText}
              disabled={true}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={textInputKeydownCheck}
            />
            <label className="flex-1/10 flex justify-center cursor-pointer">
              <Image
                src="/gallery-add.svg"
                alt="Select image"
                width={36}
                height={36}
              />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  setInputFile(e.target.files && e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
