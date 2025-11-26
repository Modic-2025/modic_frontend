"use client";
import SearchBar from "@/components/SearchBar";
import Tab, { UITab } from "@/components/Tab";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const TABS: UITab[] = [
  {
    name: "게시글",
    activated: true,
    href: "/search/art",
  },
  {
    name: "사용자",
    activated: false,
    href: "/search/user",
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const onSearch = (_keyword: string) => {
    const params = new URLSearchParams();
    params.append("q", _keyword);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="overflow-y-auto h-full flex flex-col gap-2">
      <SearchBar initKeyword={searchQuery || ""} onSearch={onSearch} />
      {searchQuery && <Tab tabs={TABS} withQuery={true} />}
      {/* <section className="h-full"> */}
      {children}
      {/* </section> */}
    </main>
  );
};

export default Layout;
