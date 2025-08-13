import { HEADER_CONTENTS_DEFAULT } from "./presets";

export type SettingHeaderContentElementsType = {
  elements: Array<HeaderContentType>;
  actions?: HeaderContentActionsType;
};
// 전체 header contents map by path
export type SettingHeaderContentsType = {
  [route: string]: SettingHeaderContentElementsType;
};
// element options
type HeaderContentElementType = {
  value?: string;
  goTo?: string;
};
// actions map by element
export type HeaderContentActionsType = {
  [element: string]: HeaderContentElementType;
};

/**
 * header contents map by path
 */
export const SETTING_HEADER_CONTENTS: SettingHeaderContentsType = {
  "/art": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]/qnas": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]/reviews": HEADER_CONTENTS_DEFAULT,
  "/art/edit/[art_id]": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "게시글 수정",
      },
    },
  },
  "/art/regist": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "게시글 등록",
      },
    },
  },
  "/users/me": {
    elements: ["logo", "option_lined"],
    actions: {
      option_lined: {
        goTo: "/users/me/settings",
      },
    },
  },
  "/users/me/settings": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "계정 및 설정",
      },
    },
  },
  "/users/me/followings": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "팔로잉",
      },
    },
  },
  "/users/me/followers": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "팔로워",
      },
    },
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
