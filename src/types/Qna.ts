type Qna = {
  id: number;
  userName: string;
  userId: number;
  createdAt: Date;
  title: string;
  content: string;
  answer: string;
  state: responseState;
};

type responseState = "WAITING" | "ANSWERED";

export const FAKE_QNA_DATAS: Qna[] = [
  {
    id: 1,
    userName: "Alice",
    userId: 101,
    createdAt: new Date("2025-06-01T10:00:00"),
    title: "Next.js에서 layout과 page의 차이점이 뭔가요?",
    content: "layout과 page 컴포넌트의 역할이 궁금합니다.",
    answer: "layout은 공통 UI, page는 실제 페이지 콘텐츠를 담당합니다.",
    state: "ANSWERED",
  },
  {
    id: 2,
    userName: "Bob",
    userId: 102,
    createdAt: new Date("2025-06-02T14:15:00"),
    title: "React에서 key prop은 왜 필요한가요?",
    content: "map으로 리스트를 렌더링할 때 key를 꼭 줘야 하나요?",
    answer:
      "key는 React가 리스트 항목을 효율적으로 업데이트하는 데 필요합니다.",
    state: "ANSWERED",
  },
  {
    id: 3,
    userName: "Charlie",
    userId: 103,
    createdAt: new Date("2025-06-03T09:30:00"),
    title: "TypeScript에서 string과 String의 차이",
    content: "string과 String 타입의 차이점이 궁금합니다.",
    answer:
      "string은 원시 타입, String은 객체 타입이므로 string을 사용하는 것이 좋습니다.",
    state: "ANSWERED",
  },
  {
    id: 4,
    userName: "Diana",
    userId: 104,
    createdAt: new Date("2025-06-04T16:50:00"),
    title: "Next.js에서 서버 컴포넌트와 클라이언트 컴포넌트 구분법",
    content: "서버 컴포넌트와 클라이언트 컴포넌트는 어떻게 구분하나요?",
    answer: "",
    state: "WAITING",
  },
  {
    id: 5,
    userName: "Eve",
    userId: 105,
    createdAt: new Date("2025-06-05T11:20:00"),
    title: "Next.js 병렬 슬롯(@header) 사용법",
    content: "병렬 슬롯을 어떻게 적용하는지 예시가 궁금합니다.",
    answer: "",
    state: "WAITING",
  },
];

export type { Qna };
