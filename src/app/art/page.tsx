import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import { artData, artThumbnails } from "@/types/Art";

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
          {artThumbnails.length > 0 && (
            <ContentViewer arts={artThumbnails} grid={2} />
          )}
        </section>
      </main>
      {/* <div className="fixed bottom-14 left-0 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2">
        <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow cursor-pointer">
          <p className="font-bold">작품 사용하기</p>
        </button>
      </div> */}
      <button className="fixed bottom-17 left-1/2 transform translate-x-[calc(50%-20px)] bg-gray-900 text-white max-w-sm px-6 p-3 rounded-full">
        <p className="font-bold">작품 등록하기</p>
      </button>
    </>
  );
}
