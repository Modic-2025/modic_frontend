import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="tabs flex flex-row">
        <button className="active basis-1/3">최신순</button>
        <button className="basis-1/3">인기순</button>
        <button className="basis-1/3">팔로잉</button>
      </nav>

      <main className="overflow-y-auto">
        <section className="gallery">
          <ContentViewer grid={2} />
        </section>
      </main>
      <Link href="/art/regist">
        <button className="fixed bottom-18 left-1/2 transform translate-x-[calc(50%-20px)] bg-gray-900 text-white max-w-sm px-6 p-3 rounded-full">
          <p className="font-bold">작품 등록하기</p>
        </button>
      </Link>
    </>
  );
}
