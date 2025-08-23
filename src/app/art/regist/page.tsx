"use client";
import ArtRegistrationForm from "@/components/ArtRegistrationForm";

export interface ImageType {
  imageUrl: string;
  imageId: string;
}

const Page = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ArtRegistrationForm />
    </div>
  );
};

export default Page;
