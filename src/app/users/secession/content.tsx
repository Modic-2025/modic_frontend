"use client";
import _fetch from "@/APIs/fetcher/ClientSide";
import SecondartButton from "@/components/Button/SecondaryButton";

const SecessionContent = () => {
  const handleSecessionClick = () => {
    _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/users`, true, {
      method: "DELETE",
      credentials: "include",
    });
  };
  return <SecondartButton text="탈퇴하기" onClick={handleSecessionClick} />;
};

export default SecessionContent;
