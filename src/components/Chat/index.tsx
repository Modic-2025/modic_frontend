"use client";
import UploadImage from "@/APIs/ImageUploader";
import useArt from "@/APIs/useArt";
import { generateImage } from "@/APIs/useGenerateImage";
import { Art } from "@/types/Art";
import Image from "next/image";
import { useEffect, useState } from "react";

// 임시로 로딩 메시지 판별의 기준
const NOW_LOADING_MSG = "이미지 생성중...";

type ChatType = {
  type: 0 | 1; // 0: opponent, 1: me
  text: string;
  image?: string;
  isLoading?: boolean;
};

const Chat = ({ artId }: { artId: number }) => {
  const { data, error, isLoading } = useArt(artId);

  // UI State
  const [chatDisabled, setChatDisabled] = useState<boolean>(true);
  const [showConfirmWindow, setShowConfirmWindow] = useState<boolean>(false);
  const [confirmState, setConfirmState] = useState<boolean>(false);
  const [chatStack, setChatStack] = useState<Array<ChatType>>([]);

  // Form data
  const [inputText, setInputText] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputImage, setInputImage] = useState<string>("");

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

  // On page load
  useEffect(() => {
    console.log("Chat component mounted");
  }, []);

  useEffect(() => {
    console.log("data :>> ", data);
    if (data) {
      const art: Art = data.data;
      const { images } = art;
      setChatStack([
        {
          type: 0,
          image: images[0].imageUrl,
          text: "이 그림체로 어떤 작품을 만들어볼까요?",
        },
      ]);
    }
  }, [data]);

  // Read file
  useEffect(() => {
    if (inputFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputImage(e.target?.result as string);
        console.log("e.target?.result :>> ", e.target?.result);
      };
      reader.readAsDataURL(inputFile);
    }
  }, [inputFile]);

  // Input image changed
  useEffect(() => {
    if (inputImage) {
      console.log("Input image changed");
      console.log("inputImage :>> ", inputImage);
      setShowConfirmWindow(true);
    }
  }, [inputImage]);

  // On confirm window close
  useEffect(() => {
    if (!showConfirmWindow) {
      setInputImage("");
      setInputFile(null);
      setChatDisabled(false);
    }
  }, [showConfirmWindow]);

  useEffect(() => {
    if (confirmState && inputFile) {
      UploadImage(inputFile, (r, e) => {
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

        generateImage(
          data.data.images[0].imageUrl,
          r[0],
          callbackGenerateImage
        );
        setConfirmState(false);
      });
    }
  }, [confirmState]);

  const callbackGenerateImage = async (res: Response, error: Error) => {
    console.log("res :>> ", res);

    if (error) {
      console.error("ERROR");
      setChatStack((prev) => [
        ...prev.filter((item) => item.text !== NOW_LOADING_MSG),
        {
          type: 0 as 0,
          text: "생성중 에러가 발생하였습니다. 잠시 후 다시 시도해주세요",
        } as ChatType,
      ]);
    }

    if (res.status == 200) {
      const data = await res.json();

      console.log("chatStack :>> ", chatStack);
      // Remove NOW_LOADING_MSG
      setChatStack((prev) => [
        ...prev.filter((item) => item.text !== NOW_LOADING_MSG),
        {
          type: 0 as 0,
          text: "요청하신 이미지를 그림체기반으로 재생성하였습니다.",
          image: `data:${data.mime_type};base64,${data.image_base64}`,
        } as ChatType,
      ]);
    }
  };

  return (
    <div className="absolute width-full height-full overflow-y-auto p-4 pb-10 inset-0">
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
                <Image
                  src={chat.image}
                  alt="origin_image"
                  layout="intrinsic"
                  width={240}
                  height={180}
                  className="mb-4 shadow-lg rounded-2xl cursor-grab"
                />
              )}
              <p className="max-w-4/5 bg-[#EEEEEE] p-2 px-4 mb-2 rounded-2xl text-[#505050] rounded-bl-none">
                {chat.text}
              </p>
            </div>
          </div>
        ) : (
          <div key={index} className="me flex justify-end gap-2 mb-4">
            <div className="chat-area">
              {chat.image && (
                <Image
                  src={chat.image}
                  alt="origin_image"
                  layout="intrinsic"
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
            placeholder="모딕이 변환할 이미지를 선택해 주세요"
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
              onChange={(e) =>
                setInputFile(e.target.files && e.target.files[0])
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Chat;
