import Link from "next/link";

const BottomButton = ({
  children,
  href,
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
}) => {
  return (
    <Link
      href={href || "#"}
      className="fixed bottom-14 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2 font-bold z-1"
    >
      <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow cursor-pointer">
        {children}
      </button>
    </Link>
  );
};

export default BottomButton;
