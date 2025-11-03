"use client";
import { TypeTreeItem } from "@/APIs/Art/tree";
import DrvTree from "@/components/Tree";

const TreeContent = ({ data }: { data: TypeTreeItem[] }) => {
  console.log("data :>> ", data);

  return (
    <div className="absolute w-sm h-full left-0">
      <DrvTree data={data} />
    </div>
  );
};

export default TreeContent;
