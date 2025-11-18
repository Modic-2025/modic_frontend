"use client";
import { APIFailureMsg } from "@/APIs";
import { AlertForm, CenteredLayout } from "@/components/Layout";
import { useRouter } from "next/navigation";

const Error = ({ data }: { data: APIFailureMsg }) => {
  const router = useRouter();

  return (
    <CenteredLayout>
      <AlertForm src="/warning.svg" title={data.title} />
      <p
        className="text-(--color-gray-4) underline"
        onClick={() => router.back()}
      >
        이전 페이지로 돌아가기
      </p>
    </CenteredLayout>
  );
};

export default Error;
