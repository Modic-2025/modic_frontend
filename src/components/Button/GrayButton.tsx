import Link from "next/link";

const className =
  "flex-1 py-1 rounded-lg bg-(--color-gray-4) text-center text-white cursor-pointer";
const GrayButton = ({
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

export default GrayButton;
