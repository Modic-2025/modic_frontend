import { createPortal } from "react-dom";
import { Background } from "..";

type OptionButtonsProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const OptionButtons = ({ children, onClose }: OptionButtonsProps) => {
  return createPortal(
    <Background onClick={onClose}>
      {/* <div className="w-lg h-auto"> */}
      <ul
        className="w-[180px] h-auto bg-white rounded-xl overflow-hidden shadow-xl font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </ul>
      {/* </div> */}
    </Background>,
    document.body
  );
};

type OptionProps = {
  // id: number;
  children: React.ReactNode;
  blocked?: boolean;
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  href?: string;
  type?: "normal" | "warn";
};
export const Option = ({
  children,
  onClick,
  href,
  type = "normal",
}: OptionProps) => (
  <li
    className={`flex w-full items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b-1 border-gray-400 text-center last:border-b-0 ${type == "warn" && "text-[#C71313]"}`}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    }}
  >
    <A href={href}>{children}</A>{" "}
  </li>
);

const A = ({ children, href }: { children: React.ReactNode; href?: string }) =>
  href ? (
    <a href={href} className="w-full h-full">
      {children}
    </a>
  ) : (
    <p className="w-full">{children}</p>
  );

export default OptionButtons;
