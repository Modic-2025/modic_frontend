import Link from "next/link";
import PrimaryButton from "../Button/PrimaryButton";
import { AlertForm, CenteredLayout } from "../Layout";

export const SUGGEST_SEARCH_POSTS = () => (
  <CenteredLayout>
    <AlertForm src="/warning.svg" title="아직 생성한 그림이 없습니다!" />
    <Link href="/art">
      <PrimaryButton text="그림 생성하러 가기" />
    </Link>
  </CenteredLayout>
);

export const NO_POSTS = () => (
  <CenteredLayout>
    <AlertForm src="/image-circle.svg" title="게시글이 없습니다." />
  </CenteredLayout>
);
