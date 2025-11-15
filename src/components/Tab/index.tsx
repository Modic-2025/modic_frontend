"use client";
import TabButton from "@/components/Tab/TabButton";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type UITab = {
  name: string;
  href?: string;
  activated?: boolean;
};
export type _UITab = UITab & {
  id: number;
};
const Tab = ({
  tabs,
  withQuery,
}: {
  tabs: Array<UITab>;
  withQuery?: boolean;
}) => {
  const searchQuery = useSearchParams();
  console.log("searchQuery.toString() :>> ", searchQuery.toString());

  const [_tabs, setTabs] = useState<Array<_UITab>>();
  const pathname = usePathname();

  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setTabs(
        tabs.map((tab, i) => ({
          ...tab,
          // href: withQuery ? `${tab.href}?${searchQuery.toString()}` : tab.href,
          id: ++i,
          activated: pathname == tab.href,
        }))
      );
    }
  }, []);

  const tabOnClickListener = (id: number) => {
    setTabs(_tabs?.map((tab) => ({ ...tab, activated: tab.id == id })));
  };

  return (
    tabs && (
      <div className="flex flex-row border-b border-gray-200 text-sm font-medium">
        {_tabs &&
          _tabs.map((tab) => (
            <TabButton
              key={tab.id}
              {...tab}
              max={_tabs.length}
              onClick={tabOnClickListener}
              href={
                withQuery ? `${tab.href}?${searchQuery.toString()}` : tab.href
              }
            >
              {tab.name}
            </TabButton>
          ))}
      </div>
    )
  );
};

export default Tab;
