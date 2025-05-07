"use client";
import UploadImage from "@/APIs/ImageUploader";
import Slider from "@/components/Slider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ImageType {
  imageUrl: string;
  imageId: string;
}

const Page = () => {
  const router = useRouter();

  const [imageUrls, setImageUrls] = useState<ImageType[]>([]);
  // Form data
  // const [files, setFiles] = useState<Array<File>>([]);
  const [title, setTitle] = useState<string>("");
  const [comCost, setComCost] = useState<number>(0);
  const [nonComCost, setNonComCost] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // Event listener가 setter 호출하는 방식
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      if (imageUrls.length + newFiles.length > 8) {
        alert("최대 8개의 이미지만 업로드할 수 있습니다.");
        return;
      }

      const { length } = newFiles;
      for (let i = 0; i < length; i++) {
        UploadImage(newFiles[i], ([imageUrl, imageId], e) => {
          if (e) {
            console.error("Error occured");
            return;
          }
          setImageUrls((prev) => [
            ...prev,
            {
              imageUrl: imageUrl,
              imageId: imageId,
            } as ImageType,
          ]);
        });
      }
    }
  };

  // On create post
  interface CreatePostPayload {
    title: string;
    description: string;
    commercialPrice: number;
    nonCommercialPrice: number;
    imageIds: string[];
  }

  const onClickCreatePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();
    imageUrls.forEach((item) => {
      formData.append("imageIds", item.imageId);
    });
    formData.append("title", title);
    formData.append("description", description);
    formData.append("commercialPrice", comCost.toString());
    formData.append("nonCommercialPrice", nonComCost.toString());

    const payload: CreatePostPayload = {
      title: title,
      description: description,
      commercialPrice: comCost,
      nonCommercialPrice: nonComCost,
      imageIds: imageUrls.map((item) => item.imageId),
    };

    fetch("http://13.124.44.90:8080/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data :>> ", data);
        const { status, isSuccess } = data;
        const { postId } = data.data;
        if (status == 201 && isSuccess) {
          router.push("/art");
          router.replace(`/art/${postId}`);
          return;
        }
      })
      .catch((error) => {
        alert(
          "서버에러로 인해 정상적으로 생성되지 않았습니다. \n잠시 후 다시 시도해주세요."
        );
        console.error("에러:", error);
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 게시글 작성 타이틀 */}
      <div className="p-4">
        <label className="block text-md font-semibold mb-2">
          그림체 대표 이미지
        </label>
        {/* 이미지 업로드 영역 */}
        <Slider items={imageUrls} maxItemNum={8}>
          <div className="bg-[#EEEEEE] rounded-xl flex flex-col items-center justify-center h-full relative">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Image
                  src="/camera.svg"
                  alt="Camera"
                  width={48}
                  height={48}
                  layout="relative"
                />
                <span className="text-gray-400 text-sm">
                  이미지 업로드 ({imageUrls.length}/8)
                </span>
                <span className="text-gray-400 text-sm">
                  최소 1개, 최대 8개까지 업로드 가능
                </span>
              </div>
              <input type="file" className="hidden" onChange={onChangeImage} />
            </label>
          </div>
        </Slider>

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
        </div>

        {/* 가격 입력란 */}
        <div className="mt-4">
          <label className="block text-md font-semibold mb-2">가격</label>
          <div className="flex flex-row items-center gap-2">
            <div className="relative basis-1/2">
              <input
                type="number"
                value={comCost}
                onChange={(e) => {
                  setComCost(Number(e.target.value));
                }}
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
                  setNonComCost(Number(e.target.value));
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
          <label className="block text-md font-semibold mb-2">
            그림체 소개
          </label>
          <div className="relative rounded-lg bg-[#EDEEEF] px-4 py-4 text-sm text-gray-600 flex flex-col min-h-[180px]">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
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
          <div className="text-right text-xs text-gray-400 mt-2">0/800</div>
        </div>

        {/* 작성 완료 버튼 */}
        <div className="mt-6">
          <button
            className="w-full h-12 rounded-lg bg-[#3E3E3E] text-white text-base"
            onClick={onClickCreatePost}
          >
            <p className="font-bold">작성 완료</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
