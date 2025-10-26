import Link from "next/link";

const BottomButton = ({
  children,
  href,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  // onClick이 있으면 button으로, href가 있으면 Link로 렌더링
  if (onClick) {
    return (
      <div className="fixed bottom-14 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2 font-bold z-10">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-3 bg-gray-900 text-white rounded-lg shadow ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {children}
        </button>
      </div>
    );
  }

  return (
    <Link
      href={href || "#"}
      className={`fixed bottom-14 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2 font-bold z-10 ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      <button
        disabled={disabled}
        className={`w-full py-3 bg-gray-900 text-white rounded-lg shadow ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children}
      </button>
    </Link>
  );
};

export default BottomButton;
