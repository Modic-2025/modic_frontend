import "@/app/root_page.css";
import ContentViewer from "@/components/ContentViewer";
import { HEADER_CONTENTS, HeaderContent } from "@/Layouts";
import MasterLayout from "@/Layouts/MasterLayout";

const headerContents: Array<HeaderContent> = [
  { ...HEADER_CONTENTS.LOGO, goTo: "/art" },
  { ...HEADER_CONTENTS.COINS, goTo: "/coins" },
  HEADER_CONTENTS.TICKETS,
  { ...HEADER_CONTENTS.SEARCH, goTo: "/search" },
];

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
