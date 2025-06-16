"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/Inputs/FormInput";
import PrimaryButton from "@/components/Button/PrimaryButton";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const nameRegex = /^[A-Za-z가-힣\s]{1,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isNameValid = name === "" || nameRegex.test(name);
  const isEmailValid = email === "" || emailRegex.test(email);

  const isActive =
    name.trim() !== "" &&
    email.trim() !== "" &&
    isNameValid &&
    isEmailValid;

  const handleNext = async () => {
    try {
      const response = await fetch("http://13.124.44.90:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: "tempPassword123!", // 임시 비밀번호
        }),
      });

      const result = await response.json();

      if (result.isSuccess && result.status === 201) {
        console.log("회원가입 성공, userId:", result.data.userId);
        const emailParam = encodeURIComponent(email);
        const nameParam = encodeURIComponent(name);
        router.push(`/signup/verify?email=${emailParam}&name=${nameParam}`);
      } else if (result.status === 409) {
        alert("이미 가입된 이메일입니다.");
      } else {
        alert("회원가입에 실패했습니다.");
        console.error("회원가입 실패:", result);
      }
    } catch (error) {
      alert("에러가 발생했습니다.");
      console.error("API 호출 에러:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
      <div>
        {/* 타이틀 */}
        <div className="mb-8">
          <h2 className="text-[24px] font-bold text-black mb-1" style={{ fontFamily: "Pretendard" }}>
            회원가입
          </h2>
          <p className="text-[16px] font-medium text-[#9E9FAD]" style={{ fontFamily: "Pretendard" }}>
            모딕에 오신 걸 환영합니다!
          </p>
        </div>

        {/* 이름 입력 */}
        <div className="mb-6">
          <label className="block text-[16px] font-bold text-black mb-2">이름</label>
          <FormInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
          <div className="flex items-center gap-1 mt-2 min-h-[20px]">
            {name && !isNameValid ? (
              <>
                <Image src="/alert-circle-filled.svg" alt="경고" width={13} height={13} />
                <p className="text-[#EB003B] text-[12px] font-medium" style={{ fontFamily: "Pretendard" }}>
                  한글 또는 영문 1~20자로 입력해주세요.
                </p>
              </>
            ) : (
              <p className="invisible text-[12px] font-medium">placeholder</p>
            )}
          </div>
        </div>

        {/* 이메일 입력 */}
        <div className="mb-10">
          <label className="block text-[16px] font-bold text-black mb-2">이메일</label>
          <FormInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
          <div className="flex items-center gap-1 mt-2 min-h-[20px]">
            {email && !isEmailValid ? (
              <>
                <Image src="/alert-circle-filled.svg" alt="경고" width={13} height={13} />
                <p className="text-[#EB003B] text-[12px] font-medium" style={{ fontFamily: "Pretendard" }}>
                  올바른 이메일 형식을 입력해주세요.
                </p>
              </>
            ) : (
              <p className="invisible text-[12px] font-medium">placeholder</p>
            )}
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="w-full">
        <PrimaryButton
          text="다음"
          disabled={!isActive}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
