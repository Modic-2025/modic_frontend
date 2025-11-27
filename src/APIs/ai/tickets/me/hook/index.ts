"use client";

import { useCallback } from "react";
import { APIFailureMsg, TITLE_500 } from "@/APIs"; // 👈 APIFailureMsg의 실제 경로로 수정하세요.
import getTickets from "..";
import useSWR from "swr";

/**
 * useTicketCount 훅이 반환하는 값의 타입
 */
interface UseTicketCountResult {
  /**
   * 성공적으로 불러온 티켓 수.
   * 로딩 중이거나 에러가 발생하면 null입니다.
   */
  ticketCount: number | null;
  /**
   * 데이터를 불러오는 중인지 여부.
   */
  isLoading: boolean;
  /**
   * API 요청 중 발생한 에러.
   * 성공 시 null입니다.
   */
  error: APIFailureMsg | null;
  /**
   * 티켓 수를 수동으로 다시 불러오는 함수.
   */
  refetchTickets: () => Promise<void>;
}

/**
 * 2. SWR을 위한 fetcher 함수 정의
 * SWR은 fetcher가 실패 시 에러를 throw 하기를 기대합니다.
 */
const ticketFetcher = async (): Promise<number> => {
  try {
    const result = await getTickets();

    // getTickets가 반환한 값의 타입에 따라 처리
    if (typeof result === "number") {
      return result; // 성공: SWR의 'data'가 됩니다.
    } else {
      // APIFailureMsg 객체가 반환된 경우 (e.g., status 500)
      throw result; // 실패: SWR의 'error'가 됩니다.
    }
  } catch (err) {
    // _fetch 자체의 예외 처리 (e.g., 네트워크 단절, JSON 파싱 실패 등)
    // 이것도 SWR의 'error'로 전달하기 위해 throw 합니다.
    const errorMsg: APIFailureMsg = {
      code: 500,
      title: TITLE_500 || "클라이언트 에러", // TITLE_500 import
      desc: (err as Error).message || "티켓을 불러오지 못했습니다.",
    };
    throw errorMsg;
  }
};

/**
 * SWR을 사용하여 티켓 수를 비동기적으로 불러오고 상태를 관리하는 React 훅입니다.
 *
 * @returns {UseTicketCountResult} 티켓 수, 로딩 상태, 에러 상태, refetch 함수
 */
export const useTicketCount = (): UseTicketCountResult => {
  // 3. useSWR 훅 사용
  // SWR 키는 API 엔드포인트와 유사한 고유한 문자열을 사용합니다.
  const swrKey = "/api/tickets/count";

  const { data, error, isLoading, mutate } = useSWR<number, APIFailureMsg>(
    swrKey,
    ticketFetcher,
    {
      // SWR 옵션 (예: 포커스 시 자동 revalidate 비활성화)
      // revalidateOnFocus: false,
    }
  );

  /**
   * 4. refetch 함수 (SWR의 mutate 사용)
   * SWR의 mutate 함수는 데이터를 다시 불러오는(revalidate) 역할을 합니다.
   */
  const refetchTickets = useCallback(async () => {
    await mutate();
  }, [mutate]);

  // 5. SWR의 반환값을 훅의 인터페이스에 맞게 조정
  return {
    // SWR의 data는 로딩 중/에러 시 undefined일 수 있으므로 null로 변환
    ticketCount: data ?? null,
    isLoading,
    // SWR의 error도 undefined일 수 있으므로 null로 변환
    error: error ?? null,
    refetchTickets,
  };
};
