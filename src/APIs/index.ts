// 200(OK)을 제외한 나머지 케이스에 대해 failure return type 입니다.
// 이를 통해 모듈에서 failure message를 넘겨주어 component에서 안내 메시지를 보여줍니다.
export const TITLE_500 = "서버에서 에러가 발생하였습니다.";
export const DESC_500 = "잠시 후 다시 시도해주세요";
export const APIFailureMsg_500 = {
  code: 500,
  title: TITLE_500,
  desc: DESC_500,
};

export const TITLE_401 = "세션이 만료되었습니다.";
export const DESC_401 = "잠시 후 로그인 페이지로 이동합니다.";
export const APIFailureMsg_401 = {
  code: 401,
  title: TITLE_401,
  desc: DESC_401,
};

export type APIFailureMsg = {
  code: number;
  title: string;
  desc?: string;
};
