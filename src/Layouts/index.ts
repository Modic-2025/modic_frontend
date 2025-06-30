export interface HeaderContent {
  value: string;
  label: string;
  backTo?: string | null;
  goTo?: string | null;
  content?: string | null;
}
export const HEADER_CONTENTS = {
  LOGO: { value: "logo", label: "로고" },
  BACKWARD: { value: "backward", label: "뒤로가기", backTo: null, goTo: null },
  TITLE: { value: "title", label: "제목" },
  OPTION_LINED: {
    value: "option_lined",
    label: "옵션",
    backTo: null,
    goTo: null,
  },
  OPTION_DOTTED: {
    value: "option_dotted",
    label: "옵션",
    backTo: null,
    goTo: null,
  },
  COINS: { value: "coins", label: "코인", backTo: null, goTo: null },
  TICKETS: { value: "tickets", label: "티켓", backTo: null, goTo: null },
  SEARCH: { value: "search", label: "검색", backTo: null, goTo: null },
  CLOSE: { value: "close", label: "닫기", backTo: null, goTo: null },
} as const;

export type HeaderContentType = keyof typeof HEADER_CONTENTS;
