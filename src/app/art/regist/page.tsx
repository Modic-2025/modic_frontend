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
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ArtRegistrationForm />
    </div>
  );
};

export default Page;
