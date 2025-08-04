"use client";
import TabButton from "@/components/Tab/TabButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type UITab = {
  name: string;
  href?: string;
  activated?: boolean;
};
export type _UITab = UITab & {
  id: number;
};
const Tab = ({ tabs }: { tabs: Array<UITab> }) => {
  const [_tabs, setTabs] = useState<Array<_UITab>>();
  const pathname = usePathname();

  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setTabs(
        tabs.map((tab, i) => ({
          ...tab,
          id: ++i,
          activated: pathname == tab.href,
        }))
      );
    }
  });

  const tabOnClickListener = (id: number) => {
    setTabs(_tabs?.map((tab) => ({ ...tab, activated: tab.id == id })));
  };

  return (
    tabs && (
      <div className="flex flex-row border-b border-gray-200 text-sm font-medium">
        {_tabs &&
          _tabs.map((tab) => (
            <TabButton key={tab.id} {...tab} onClick={tabOnClickListener}>
              {tab.name}
            </TabButton>
          ))}
      </div>
    )
  );
};

export default Tab;
