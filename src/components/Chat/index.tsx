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
import UseCoins from "@/hooks/UseCoins";
import Fail from "../Popups/Fail";
import ImageList from "../ImageList";
import useIntersectionObserver from "@/hooks/UseIntersectionObserver";
import getChatMessages from "@/APIs/posts/chat/messages/get/client";
import subsSSE, { getPendingReqById } from "./subscribeSSE";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { TypeChat, TypeChatData } from "./types";
import { CHAT_ERROR_REFRESH, CHAT_LOADING_MSG } from "./datas";
import Link from "next/link";

// Refactor chat data as type `TypeChat`
const refacorChatData = (data: TypeChatData): TypeChat => {
  if (data) {
    return { ...data, createdAt: new Date(data.createdAt) };
  }
  console.error("[refactorChatData]: data가 올바르지 않습니다. >> ", data);
  return CHAT_ERROR_REFRESH;
};

type PropChat = {
  artId: number;
  chatHistory?: TypeChatData[];
  page: number;
};
const Chat = ({ artId, chatHistory, page }: PropChat) => {
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
  // Page of chat stack
  const [chatPage, setChatPage] = useState<number>(page);
  // Info overlay
  const [isInfoOverlayOpen, setIsInfoOverlayOpen] = useState<boolean>(false);

  const [isInitScrolled, setIsInitScrolled] = useState<boolean>(false);

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
  const [observeRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });
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
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      sendMsg();
    }
  };

  // on-click event on buy permission window
  const onClickBuy = async () => {
    setShowBuyWindow(false);
    const response = await buyPermissionWithCoin(safeArtId);
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
      const { imageUrl } = data;
      await setChatStack([...chatStack, refacorChatData(data)]);
      appendLoadingMsg(data);

      chatScrollToEndWithDelay(Boolean(imageUrl)); // UI control

      subsSSE(artId, data, handleMsgReceived);
    }
  };
  const handleMsgReceived = async (e: EventSourceMessage) => {
    const { data } = e;
    const chatResponse: TypeChatData = await JSON.parse(data);
    const safeChatResponse: TypeChat = refacorChatData(chatResponse);

    const pendingRequest = getPendingReqById(artId);
    // ERROR CASE: 현재 대기중인 요청이 없을 경우
    if (!pendingRequest) {
      console.error("ERROR CASE: 현재 대기중인 요청이 없을 경우");
      return;
    }
    let safeRequest = null;
    // Parse pending request
    try {
      safeRequest = JSON.parse(pendingRequest);
    } catch (e) {
      // ERROR CASE: 현재 대기중인 요청 데이터가 정상적이지 않을 경우
      throw new Error(e);
    }

    // Update status
    setChatStack((prev) => {
      // Update `REQUEST_PENDING` to `REQUEST` (complete)
      let safePrev = prev.map((item) => ({
        ...item,
        status:
          item.requestId === safeRequest.requestId &&
          item.status === "REQUEST_PENDING"
            ? "REQUEST"
            : item.status,
      }));
      // Filtering loading state message
      const result = safePrev
        .filter((item) => !item.isLoading)
        .concat(safeChatResponse);
      return result;
    });
    chatScrollToEndWithDelay(Boolean(chatResponse.imageUrl)); // UI control

    setChatDisabled(false);
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
  const chatScrollToEndWithDelay = (hasImage: boolean) => {
    setTimeout(
      () => {
        chatScrollToEnd();
      },
      hasImage ? 400 : 100
    );
  };
  const appendLoadingMsg = (requestId: string) => {
    setChatStack((prev) => {
      return [...prev, { ...CHAT_LOADING_MSG, reqeustId: requestId }];
    });
  };

  /**
   * Effects
   */
  // Scroll chat stack at initialize
  useEffect(() => {
    if (chatStack && !isInitScrolled && chatStack.length > 0) {
      setTimeout(() => {
        chatScrollToEnd();
      }, 400);

      const item = getPendingReqById(artId);
      if (item) {
        const chatData: TypeChat = JSON.parse(item);
        subsSSE(artId, chatData, handleMsgReceived);
        appendLoadingMsg(chatData.requestId);
      }

      setIsInitScrolled(true);
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

      if (chatHistory) {
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
                  createdAt: new Date(),
                  status: "RESPONSE",
                },
              ]
        );

        // 첫 페이지(-1)가 아니고, 메시지가 10개 이하일 때, 메시지를 추가적으로 fetch 한다.
        if (chatPage >= 0 && chatHistory.length < 10) {
          _getChatMessages(art.postId, chatPage, 30);
        }
      }

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
    if (isInView && !isChatFetching && art && chatPage >= 0) {
      _getChatMessages(art.postId, chatPage, 30);
    }
  }, [isInView]);
  const _getChatMessages = async (
    postId: number,
    page: number,
    size: number
  ) => {
    const safePage = page - 1;
    if (safePage < 0) return; // blocking
    setIsChatFetching(true);
    const res = await getChatMessages(postId, safePage, size);
    // Guard against API failure shape which doesn't include `content`
    if (!res || !("content" in res)) {
      console.error("Failed to fetch chat messages:", res);
      setIsChatFetching(false);
      return;
    }
    const { content }: { content: TypeChat[] } = res;
    setChatStack((prev) => [...content].concat(prev));
    setChatPage(safePage);

    setIsChatFetching(false);
  };

  // Uploads current selected image
  const UploadCurrentImage = () => {
    inputFile && UploadImage(inputFile, imageOnUpload, "AI_REQUEST", artId);
  };

  const imageOnUpload = async (r: [string, string, string], e: unknown) => {
    if (e) {
      console.error("Error occured in image upload");
      return;
    }
    const [imageUrl, imagePath, imageId] = r;

    setInputImage({
      imageUrl,
      imageId: Number(imageId),
    });
    // initialize callback state
    setBuyPermCBState(false);
  };

  // For ImageList component
  const onDeleteImageList = (id: number) => {
    setInputImage(null);
  };

  // Render function
  const renderDayOfWeek = (day: number) => {
    switch (day) {
      case 0:
        return "일";
      case 1:
        return "월";
      case 2:
        return "화";
      case 3:
        return "수";
      case 4:
        return "목";
      case 5:
        return "금";
      case 6:
        return "토";
      default:
        return "NONE";
    }
  };

  // Classnames
  const inputarea_classname = `fixed bottom-0 inset-x-0 mx-auto max-w-sm pb-0`;

  return (
    <>
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

        {isInfoOverlayOpen ? (
          <div
            className="fixed top-14 left-[calc(50vw-180px)] w-[calc(384px-24px)] h-24 bg-white rounded-md shadow-xl flex gap-2 p-2 z-1 motion-preset-expand motion-duration-500"
            onClick={() => setIsInfoOverlayOpen(false)}
          >
            {art && (
              <>
                <section className="relative basis-1/4 overflow-hidden rounded-lg">
                  <ClickableImage
                    src={art.images[0].imageUrl}
                    alt="스타일 이미지"
                    // width={80}
                    // height={80}
                    fill
                  />
                </section>
                <section className="basis-3/4 flex items-center">
                  <div>
                    <Link
                      href={`/art/${artId}`}
                      className="text-md font-bold underline block mb-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {art?.title}
                    </Link>
                    <p className="w-full text-sm text-(--color-gray-4) overflow-hidden">
                      {art.userName} | {art.userEmail}
                    </p>
                  </div>
                </section>
              </>
            )}
          </div>
        ) : (
          <button
            className="fixed top-14 left-[calc(50vw-180px)] w-12 h-12 rounded-full bg-white shadow-xl cursor-pointer z-1 motion-preset-expand motion-duration-300"
            onClick={() => setIsInfoOverlayOpen(true)}
          >
            <Image src="/info-circle.svg" alt="정보" width={48} height={48} />
          </button>
        )}

        {observeRef && typeof observeRef === "object" && (
          <div ref={observeRef}></div>
        )}

        {/* Chat history */}
        {chatStack.map((chat, index) => (
          <>
            {chatStack[index - 1 > 0 ? index - 1 : 0] &&
              chatStack[index - 1 > 0 ? index - 1 : 0].createdAt.getDate() !==
                chat.createdAt.getDate() && (
                <div className="text-center mb-4">
                  <p className="font-bold text-(--color-gray-4)">
                    {chat.createdAt.getFullYear()}.{chat.createdAt.getMonth()}.
                    {chat.createdAt.getDate()} (
                    {renderDayOfWeek(chat.createdAt.getDay())})
                  </p>
                </div>
              )}
            {chat.senderType === "AI" ? (
              <div
                key={chat.messageId}
                className={`opponent flex flex-row items-end gap-2 mb-4`}
              >
                <div className="profile basis-1/10">
                  <Image
                    src="/opponent-profile-icon.svg"
                    alt="opponent"
                    className="relative"
                    width={48}
                    height={48}
                  />
                </div>
                <div
                  className={`chat-area basis-9/10 ${
                    chat.isLoading &&
                    "motion-preset-blink motion-duration-2000 [--motion-loop-opacity:0.4] rounded-2xl"
                  }`}
                >
                  {chat.imageUrl && (
                    <ClickableImage
                      src={chat.imageUrl}
                      alt="origin_image"
                      // layout="intrinsic"
                      width={240}
                      height={180}
                      className="shadow-lg cursor-pointer rounded-2xl mb-4"
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
                {chat.imageUrl && (
                  <ClickableImage
                    src={chat.imageUrl}
                    alt="origin_image"
                    // layout="intrinsic"
                    width={240}
                    height={180}
                    className="mb-4 shadow-lg cursor-pointer rounded-2xl"
                  />
                )}
                {chat.textContent && (
                  <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-br-none">
                    {chat.textContent}
                  </p>
                )}
              </div>
            )}
          </>
        ))}

        <div className={inputarea_classname}>
          {inputImage && (
            <div className="px-2">
              <ImageList
                items={[inputImage]}
                max={1}
                mode={"ONLY-ONE"}
                onDelete={onDeleteImageList}
              />
            </div>
          )}
          <div className="flex flex-row h-16 bg-white gap-2 p-2">
            <label
              className={`flex flex-1/10 justify-center cursor-pointer ${chatDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Image
                src="/gallery-add.svg"
                alt="Select image"
                width={32}
                height={32}
              />
              <input
                type="file"
                className="hidden"
                disabled={chatDisabled}
                onChange={(e) => {
                  setInputFile(e.target.files && e.target.files[0]);
                }}
              />
            </label>
            <input
              className="w-full h-full inset-0 flex-8/10 bg-(--color-gray-1) px-4 rounded-md disabled:opacity-50"
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
