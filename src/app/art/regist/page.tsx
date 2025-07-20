"use client";
import UploadImage from "@/APIs/ImageUploader";
import ArtRegistrationForm from "@/components/ArtRegistrationForm";
import Slider from "@/components/Slider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ImageType {
  imageUrl: string;
  imageId: string;
}

const MAX_IMAGE_NUM = 8;

const Page = () => {
  const router = useRouter();

  const [imageUrls, setImageUrls] = useState<ImageType[]>([]);
  // Form data
  const [title, setTitle] = useState<string>("");
  const [comCost, setComCost] = useState<number>(0);
  const [nonComCost, setNonComCost] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState<number>(0);

  // Event listener
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      if (imageUrls.length + newFiles.length > MAX_IMAGE_NUM) {
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

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 800) return;
    setDescription(value);
    setDescriptionLength(value.length);
  };

  // On create post
  interface CreatePostPayload {
    title: string;
    description: string;
    commercialPrice: number;
    nonCommercialPrice: number;
    imageIds: string[];
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ArtRegistrationForm />
    </div>
  );
};

export default Page;
