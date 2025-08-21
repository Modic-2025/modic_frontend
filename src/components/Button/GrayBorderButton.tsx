import Link from "next/link";

const className =
  "flex-1 py-1 rounded-lg border-(--color-gray-1) border text-center cursor-pointer";
const GrayBorderButton = ({
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

export default GrayBorderButton;
