import { _UITab } from "@/components/Tab";
import Link from "next/link";

type prop = _UITab & {
  onClick?: (id: number) => void;
  children: React.ReactNode;
};
const TabButton = ({ id, children, href, activated, onClick }: prop) => (
  <Link
    href={href || "#"}
    className={`basis-1/3 py-3 ${activated ? "text-black" : "text-(--color-gray-4)"} text-center cursor-pointer ${activated && "border-b-[1.5px] border-black"}`}
    onClick={(e) => {
      onClick && onClick(id);
    }}
  >
    {children}
  </Link>
);

export default TabButton;
