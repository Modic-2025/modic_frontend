import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import { NO_POSTS } from "@/components/ContentViewer/placeholders";
import Link from "next/link";

export default function Home() {
  return (
    // <MasterLayout headerContents={headerContents}>
    <main className="h-full overflow-y-auto">
      {/* <section> */}
      <ContentViewer grid={2}>
        <NO_POSTS />
      </ContentViewer>
      {/* </section> */}
      <Link
        href="/art/regist"
        className="fixed bottom-16 z-10 right-[calc(50vw-180px)]"
      >
        <button className="bg-(--color-main) p-4 py-2 rounded-full text-white font-bold shadow-md cursor-pointer z-30">
          {" "}
          그림 등록하기{" "}
        </button>
      </Link>
    </main>
    // </MasterLayout>
  );
}
