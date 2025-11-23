import Image from "next/image";
import Link from "next/link";

const NotificationTemplate = ({
  iconSrc,
  title,
  children,
  date,
  isUnread = false,
  href = "",
}: {
  iconSrc: string;
  title: string;
  children?: React.ReactNode;
  date: Date;
  isUnread?: boolean;
  body: string;
  postId?: number;
  href?: string;
}) => (
  <li
    className={`min-h-18 py-2 ${isUnread ? "bg-(--color-light-main)" : "bg-white"} border-b-(--color-gray-2) border-b-1 last:border-none`}
  >
    <Link href={href} className="flex flex-row gap-2">
      <section className="flex basis-12">
        <Image src={iconSrc} alt={iconSrc} width={48} height={48} />
      </section>
      <section className="flex items-center justify-start basis-[calc(100%-88px)]">
        <NotiTextTemplate value={title} />
        {children}
      </section>
      <section className="basis-10 flex items-center">
        <DateAgo date={date} />
      </section>
    </Link>
  </li>
);

export const timeAgo = (date: Date | string | number): string => {
  // 1. 입력된 날짜를 Date 객체로 변환
  const start = new Date(date);
  // 2. 현재 시간
  const end = new Date();

  // 3. 차이 계산 (초 단위)
  // getTime()은 밀리초 단위이므로 1000으로 나누어 초(second)로 변환
  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  // 미래의 시간이 들어온 경우 (혹은 시간이 엇비슷해서 음수가 나온 경우) 처리
  if (seconds < 1) return "방금 전";

  // 4. 시간 단위별 정의 (큰 단위부터 내림차순 검사)
  const intervals = [
    { label: "년", seconds: 60 * 60 * 24 * 365 },
    { label: "달", seconds: 60 * 60 * 24 * 30 },
    { label: "일", seconds: 60 * 60 * 24 },
    { label: "시간", seconds: 60 * 60 },
    { label: "분", seconds: 60 },
  ];

  // 5. 반복문을 돌며 적절한 단위 찾기
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    // 해당 단위로 나누었을 때 1 이상이면 그 단위를 사용
    if (count >= 1) {
      return `${count}${interval.label} 전`;
    }
  }

  // 1분 미만인 경우
  return "방금 전";
};
const DateAgo = ({ date }: { date: Date }) => {
  return <p className="text-(--color-gray-4) text-sm">{timeAgo(date)}</p>;
};

const NotiTextTemplate = ({ value }: { value: string }) => (
  <p className="text-(--color-gray-8) font-bold text-sm">{value}</p>
);

export default NotificationTemplate;
