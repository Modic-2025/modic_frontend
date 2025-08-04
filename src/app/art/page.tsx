import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import { HEADER_CONTENTS, HeaderContent } from "@/Layouts";
import MasterLayout, { defaultHeaderContents } from "@/Layouts/MasterLayout";

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
