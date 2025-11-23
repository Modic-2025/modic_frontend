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
  "/login": {
    elements: ["backward"],
  },
  "/art": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]/qnas": HEADER_CONTENTS_DEFAULT,
  "/art/[art_id]/reviews": HEADER_CONTENTS_DEFAULT,
  "/search/art": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "검색",
      },
    },
  },
  "/search/user": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "검색",
      },
    },
  },
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
  "/art/regist/[image_id]": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "2차 창작물 등록",
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
  "/users/me/edit": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "비밀번호 확인",
      },
    },
  },
  "/users/me/edit/profile": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "프로필 편집",
      },
    },
  },
  "/users/[user_id]": {
    elements: ["backward", "title", "option_dotted"],
  },
  "/art/ai/[art_id]": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "이미지 생성하기",
      },
    },
  },
  "/users/me/created-images": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "생성한 이미지",
      },
    },
  },
  "/vote": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "저작권 투표",
      },
    },
  },
  "/art/tree/[art_id]": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "2차 창작물 트리",
      },
    },
  },
  "/notifications": {
    elements: ["backward", "title"],
    actions: {
      title: {
        value: "알림",
      },
    },
  },
};

// 동적 path를 정적 path로 변환하여 매칭시키기 위한 함수
// 동적 path일 경우 이 함수를 통해 전처리를 해주어야 합니다.
// .replace(target_regex, replace_string)
export const convertToRoutePattern = (pathName: string) => {
  return pathName
    .replace(/^\/art\/(\d+)/, "/art/[art_id]")
    .replace(/^\/art\/edit\/(\d+)/, "/art/edit/[art_id]")
    .replace(/^\/users\/(\d+)/, "/users/[user_id]")
    .replace(/^\/art\/ai\/(\d+)/, "/art/ai/[art_id]")
    .replace(/^\/art\/regist\/(\d+)/, "/art/regist/[image_id]")
    .replace(/^\/art\/tree\/(\d+)/, "/art/tree/[art_id]");
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
