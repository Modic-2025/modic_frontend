import { createPortal } from "react-dom";

export const Background = ({
  children,
  onClick,
  noBg = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  noBg?: boolean;
}) =>
  createPortal(
    <div
      className={`fixed max-w-sm mx-auto inset-x-0 h-full flex justify-center items-center ${!noBg && "bg-[#2B2B2B]/60"} z-50`}
      onClick={onClick}
    >
      {children}
    </div>,
    document.body
  );

export const PopupWrapper = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e) => void;
}) => (
  <div
    onClick={onClick}
    className="w-xs min-h-[100px] bg-white rounded-xl p-4 text-center motion-preset-expand motion-duration-300"
  >
    {children}
  </div>
);
