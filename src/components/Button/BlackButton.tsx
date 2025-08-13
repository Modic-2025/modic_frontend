import Link from "next/link";

const className =
  "flex-1 py-1 rounded-lg bg-black text-white text-center cursor-pointer";
const BlackButton = ({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) =>
  href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );

export default BlackButton;
