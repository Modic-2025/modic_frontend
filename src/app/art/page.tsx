import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";

export default function Home() {
  return (
    // <MasterLayout headerContents={headerContents}>
    <main className="overflow-y-auto">
      <section>
        <ContentViewer grid={2} />
      </section>
    </main>
    // </MasterLayout>
  );
}
