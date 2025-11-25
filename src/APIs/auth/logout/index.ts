import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

const logout = async (): Promise<boolean | APIFailureMsg> => {
  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/logout`, true, {
      method: "POST",
    })
  ).json();
  const { isSuccess, status } = response;
  if (!isSuccess) {
    switch (status) {
      case 404:
        return { code: 404, title: "이미 로그아웃된 세션입니다." };
      default:
        return { code: 500, title: TITLE_500 };
    }
  }

  return true;
};

export default logout;
