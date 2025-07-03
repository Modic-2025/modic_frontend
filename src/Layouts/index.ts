type HeaderContentElementType = {
  value?: string;
  goTo?: string;
};
export type HeaderContentActionsType = {
  [element: string]: HeaderContentElementType;
};
type SettingHeaderContentsType = {
  [route: string]: {
    elements: Array<HeaderContentType>;
    actions?: HeaderContentActionsType;
  };
};
export const SETTING_HEADER_CONTENTS: SettingHeaderContentsType = {
  "/art": {
    elements: ["logo", "coins", "tickets", "search"],
  },
  "/art/[art_id]": {
    elements: ["logo", "coins", "tickets", "search"],
  },
  "/users/me": {
    elements: ["logo", "option_lined"],
  },
  "/users/[user_id]": {
    elements: ["logo", "title", "option_dotted"],
  },
};

export interface HeaderContent {
  value: string;
  label: string;
  backTo?: string | null;
  goTo?: string | null;
  content?: string | null;
}
export const HEADER_CONTENTS = {
  LOGO: { value: "logo", label: "로고" },
  BACKWARD: { value: "backward", label: "뒤로가기", goTo: null },
  TITLE: { value: "title", label: "제목" },
  LIKE: { value: "like", label: "찜목록" },
  OPTION_LINED: {
    value: "option_lined",
    label: "옵션",

    goTo: null,
  },
  OPTION_DOTTED: {
    value: "option_dotted",
    label: "옵션",

    goTo: null,
  },
  COINS: { value: "coins", label: "코인", goTo: null },
  TICKETS: { value: "tickets", label: "티켓", goTo: null },
  SEARCH: { value: "search", label: "검색", goTo: null },
  CLOSE: { value: "close", label: "닫기", goTo: null },
} as const;

export type HeaderContentType =
  (typeof HEADER_CONTENTS)[keyof typeof HEADER_CONTENTS]["value"];
