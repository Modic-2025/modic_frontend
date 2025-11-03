import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import Link from "next/link";

export default function Home() {
  return (
    // <MasterLayout headerContents={headerContents}>
    <main className="overflow-y-auto">
      <section>
        <ContentViewer grid={2} />
      </section>
      <Link
        href="/regist"
        className="fixed bottom-16 z-10 right-[calc(50vw-180px)]"
      >
        <button className="bg-(--color-main) p-4 py-2 rounded-full text-white font-bold shadow-md cursor-pointer">
          {" "}
          그림 등록하기{" "}
        </button>
      </Link>
    </main>
    // </MasterLayout>
  );
}
