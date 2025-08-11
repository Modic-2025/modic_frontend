import Link from "next/link";

// href 여부에 따라서 next/link를 wrapping 해주는 컴포넌트 입니다.
const A = ({ children, href }: { children: React.ReactNode; href: string }) =>
  href ? <Link href={href}>{children}</Link> : children;

export default A;
