"use client";
import _fetch from "@/APIs/fetcher/ClientSide";
import UploadImage from "@/APIs/ImageUploader";
import useArt from "@/APIs/useArt";
import generateImage from "@/APIs/useGenerateImage";
import useRemainGens from "@/hooks/UseRemainGens";
import { Art, ImageType } from "@/types/Art";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SWRResponse, useSWRConfig } from "swr";
import ClickableImage from "../ClickableImage";
import Confirm from "../Popups/Confirm";
import buyPermissionWithCoin from "@/APIs/ai/image-permissions/buy-with-coin";
import Error from "next/error";
import UseCoins from "@/hooks/UseCoins";
import Fail from "../Popups/Fail";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ImageList from "../ImageList";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import getChatMessages from "@/APIs/posts/chat/messages/get/client";

// 임시로 로딩 메시지 판별의 기준
const NOW_LOADING_MSG = "응답 대기중 ..";

type TypeChatUI = {
  // For UI
  isLoading?: boolean;
};
export type TypeChatData = {
  messageId: number; // loading 등의 fake message는 id를 -1로 설정
  messageOrder: number; // loading 등의 fake message는 id를 -1로 설정
  senderType: "AI" | "USER";
  textContent?: string;
  requestId: string;
  imageUrl?: string;
  createdAt: Date;
  status: "REQUEST" | "REQUEST_PENDING" | "REQUEST_FAILED" | "RESPONSE";
};

type TypeChat = TypeChatUI & TypeChatData;
// Refactor chat data as type `TypeChat`
const refactorChatData = (data: TypeChat | TypeChat[]) => {
  return data;
};

type PropChat = {
  artId: number;
  chatHistory?: TypeChatData[];
};
const Chat = ({ artId, chatHistory }: PropChat) => {
  let safeArtId: number = -1;
  try {
    safeArtId = Number(artId);
  } catch (e) {
    console.error(`artId: ${artId}를 Number 형으로 변환하지 못하였습니다.`);
  }
  /**
   * UI states
   */
  // Component initialized state
  const [isUIInitialized, setInit] = useState<boolean>(false);
  // Current art state
  const { data: art }: SWRResponse<Art, Error> = useArt(safeArtId);
  // Disable input text UI state
  const [chatDisabled, setChatDisabled] = useState<boolean>(false); // For disable input text
  // Popup window that buy permissions
  const [showBuyWindow, setShowBuyWindow] = useState<boolean>(false); // Confirm window
  // Popup window that failed to buy permissions
  const [showBuyFailWindow, setShowBuyFailWindow] = useState<boolean>(false); // Fail window
  const [buyFailTitle, setBuyFailTitle] = useState<string>(""); // Fail window
  // Chat stack states
  const [chatStack, setChatStack] = useState<TypeChat[]>([]);
  // Remain generations of posts
  const { data: remainingGen } = useRemainGens(Number(safeArtId));
  // Coins of account
  const { data: coins } = UseCoins();
  /**
   * [Compoent using state]
   * For managing callback works at two cases
   * - Image upload: Uploads image and staging image (no sent)
   * - Message sent: send message with staged images
   * if this state true, then run `Image upload` case
   * false, run `Message sent` case
   * this state controlled when no-permissions state
   */
  const [buyPermCallbackState, setBuyPermCBState] = useState<boolean>(false);

  // Mutate SWR state
  const { mutate } = useSWRConfig();

  // Intersection observer
  const [observeRef, isIsView] = useIntersectionObserver({ threshold: 0.6 });
  const [isChatFetching, setIsChatFetching] = useState<boolean>(false);

  // Refs
  const chatRef = useRef<HTMLDivElement>(null);

  // Form data
  const [inputText, setInputText] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputImage, setInputImage] = useState<ImageType | null>(null);

  /**
   * Events
   */
  // key-down on input
  const textInputKeydownCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block
    if (inputText.trim() === "") {
      return;
    }
    // console.log("e :>> ", e);
    // console.log("inputText :>> ", inputText);
    if (e.nativeEvent.isComposing) {
      // console.log("composing disable");
      return;
    }
    if (e.key === "Enter") {
      sendMsg();
    }
  };

  // on-click event on buy permission window
  const onClickBuy = async () => {
    const response = await buyPermissionWithCoin(safeArtId);
    setShowBuyWindow(false);
    // On success
    if (typeof response === "boolean" && response) {
      mutate([`remaining-generations`, art?.postId]);
      if (buyPermCallbackState) {
        UploadCurrentImage();
        return;
      }
      sendMsg();
      return;
      // inputFile && readFileAndSetImage(inputFile); // read file and run the process
    }
    const { title } = response;
    setShowBuyFailWindow(true);
    setBuyFailTitle(title);
  };

  /**
   * Methods
   */
  const sendMsg = async () => {
    if (!remainingGen || remainingGen <= 0) {
      setShowBuyWindow(true);
      return;
    }
    if (!inputImage && !inputText) return;
    setInputText("");
    setInputImage(null);
    setChatDisabled(true);
    const responseGenerateImage = await (
      await generateImage(artId, inputText, inputImage?.imageId)
    ).json();
    const { status, isSuccess, data } = responseGenerateImage;
    if (!isSuccess) {
      console.error("ERROR");
      setChatStack((prev) => [
        ...prev.filter((item) => !item.isLoading),
        {
          senderType: "AI",
          textContent: `생성중 에러가 발생하였습니다. 잠시 후 다시 시도해주세요 (${status})`,
        } as TypeChat,
      ]);
    }
    // Assign SSE
    if (status === 200) {
      const { requestId } = data;
      console.log("data :>> ", data);
      setChatStack((prev) => [
        ...prev,
        {
          messageId: -1,
          messageOrder: -1,
          senderType: "USER",
          textContent: inputText,
          requestId: -1,
          imageUrl: inputImage?.imageUrl ?? undefined,
          createdAt: new Date(""),
          status: "REQUEST_PENDING",
        },
        {
          messageId: -1,
          messageOrder: -1,
          senderType: "AI",
          textContent: "응답 대기중 ..",
          requestId: -1,
          createdAt: new Date(""),
          isLoading: true,
          status: "RESPONSE",
        },
      ]);
      const token = localStorage.getItem("accessToken");
      await fetchEventSource(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${artId}/chat/sse/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          async onmessage(e) {
            const { data } = e;
            console.log("data :>> ", data);
            const { textContent, imageUrl } = await JSON.parse(data);
            setChatStack((prev) => [
              ...prev.filter((item) => item.textContent !== NOW_LOADING_MSG),
              {
                senderType: "AI",
                textContent: textContent,
                imageUrl: imageUrl,
              } as TypeChat,
            ]);
            setChatDisabled(false);
          },
        }
      );
    }
  };

  // Fetch chat by message id
  const fetchChats = (orderId: number) => {
    setIsChatFetching(true); // disable fetching
    if (isChatFetching) return;
    // getChatMessages()
    setIsChatFetching(false); // turn off
  };

  /**
   * UI controls
   */
  // Scroll chat-stack to bottom-end
  const chatScrollToEnd = () => {
    const { current } = chatRef;
    if (current) {
      current.scrollTo({
        top: current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  /**
   * Effects
   */
  // Scroll to end when chat stack changed
  useEffect(() => {
    if (chatStack) {
      setTimeout(() => {
        chatScrollToEnd();
      }, 400);
    }
  }, [chatStack]);

  /**
   * Managing callback state
   */
  useEffect(() => {
    if ((inputFile && !remainingGen) || remainingGen <= 0) {
      setBuyPermCBState(true);
    }
  }, [inputFile]);

  // Initialize UI
  // Work as mount life cycle (fetch chat history)
  useEffect(() => {
    if (art && !isUIInitialized) {
      const { images, postId } = art;
      console.log("chatHistory :>> ", chatHistory);
      // if ("code" in response) {
      //   return;
      // }
      // Data refactoring for UI
      setChatStack(
        chatHistory && chatHistory.length > 0
          ? chatHistory
          : [
              {
                messageId: -1,
                messageOrder: -1,
                senderType: "AI",
                imageUrl: images[0].imageUrl,
                requestId: "",
                textContent: "이 그림체로 어떤 작품을 만들어볼까요?",
                createdAt: new Date(""),
                status: "RESPONSE",
              },
            ]
      );
      [
        // old
        [].reverse(),
        ...[
          /* current */
        ],
      ]; // new

      setInit(true); // Set flag
    }
  }, [art]);

  /**
   * PROCESSING INPUT FILE
   */
  useEffect(() => {
    if (remainingGen <= 0) {
      setShowBuyWindow(true);
      return;
    }
    if (inputFile) {
      UploadCurrentImage();
    }
  }, [inputFile]);

  // Fetch old messages
  useEffect(() => {
    if (isIsView && !isChatFetching) {
      console.log("Fetch new messages called!");
      // fetchChats();
    }
  }, [isIsView]);

  // Uploads current selected image
  const UploadCurrentImage = () => {
    inputFile && UploadImage(inputFile, imageOnUpload, "AI_REQUEST", artId);
  };

  const imageOnUpload = async (r, e) => {
    if (e) {
      console.error("Error occured in image upload");
      return;
    }
    const [imageUrl, imagePath, imageId] = r;

    setInputImage({
      imageUrl,
      imageId,
    });
    // initialize callback state
    setBuyPermCBState(false);
  };

  // For ImageList component
  const onDeleteImageList = (id: number) => {
    setInputImage(null);
  };

  // Classnames
  const inputarea_classname = `fixed bottom-0 inset-x-0 mx-auto max-w-sm p-2 pb-0 ${inputImage ? "h-40" : "h-16"}`;

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
            onCancel={() => {
              setShowBuyWindow(false);
              setInputFile(null); // also cancel input files
            }}
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
        <div ref={observeRef}></div>
        {/* Chat history */}
        {chatStack.map((chat, index) =>
          chat.senderType === "AI" ? (
            <div
              key={index}
              className={`opponent flex flex-row items-end gap-2 mb-4`}
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
              <div
                className={`chat-area basis-9/10 ${
                  chat.isLoading &&
                  "motion-preset-blink motion-duration-2000 [--motion-loop-opacity:0.4]"
                }`}
              >
                {chat.imageUrl && (
                  <ClickableImage
                    src={chat.imageUrl}
                    alt="origin_image"
                    // layout="intrinsic"
                    width={240}
                    height={180}
                    className="mb-4 shadow-lg rounded-2xl cursor-grab"
                  />
                )}
                {chat.textContent && (
                  <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-bl-none">
                    {chat.textContent}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="me flex flex-col justify-end mb-4 items-end"
            >
              {/* <div className="chat-area text-right"> */}
              {chat.imageUrl && (
                <ClickableImage
                  src={chat.imageUrl}
                  alt="origin_image"
                  // layout="intrinsic"
                  width={240}
                  height={180}
                  className="mb-4 shadow-lg rounded-2xl cursor-grab"
                />
              )}
              {chat.textContent && (
                <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-br-none">
                  {chat.textContent}
                </p>
              )}
              {/* </div> */}
            </div>
          )
        )}

        <div className={inputarea_classname}>
          {inputImage && (
            <div className="pb-2 px-2">
              <ImageList
                items={[inputImage]}
                max={1}
                mode={"ONLY-ONE"}
                onDelete={onDeleteImageList}
              />
            </div>
          )}
          <div className="flex flex-row h-14 bg-white gap-2 py-2">
            <label className="flex flex-1/10 justify-center cursor-pointer">
              <Image
                src="/gallery-add.svg"
                alt="Select image"
                width={32}
                height={32}
              />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  setInputFile(e.target.files && e.target.files[0]);
                }}
              />
            </label>
            <input
              className="w-full h-full inset-0 flex-8/10 bg-(--color-gray-1) px-4 rounded-md"
              placeholder={
                remainingGen <= 0
                  ? "그림체를 변환하기 위해 구매가 필요해요"
                  : `앞으로 ${remainingGen}번 그림체 변환 가능합니다!`
              }
              value={inputText}
              disabled={chatDisabled}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={textInputKeydownCheck}
            />
            <button className="cursor-pointer" onClick={() => sendMsg()}>
              <Image
                src={
                  inputText.trim() !== "" || inputImage
                    ? "/send-primary.svg"
                    : "/send-button.svg"
                }
                width="36"
                height="36"
                alt="보내기"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
