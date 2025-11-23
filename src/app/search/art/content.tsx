"use client";

import { TypeSearchContent } from "@/APIs/search";
import ContentViewer from "@/components/ContentViewer";
import { NO_SEARCH_RESULTS_POST } from "@/components/ContentViewer/placeholders";
import { Art_thumbnail } from "@/types/Art";

type TypeProp = {
  data: TypeSearchContent<Art_thumbnail>;
};
const SearchArtContent = ({ data }: TypeProp) => {
  const { content } = data;

  return (
    <ContentViewer
      arts={content}
      showTabs={false}
      grid={2}
      mode={"PRESENTATIONAL"}
    >
      <NO_SEARCH_RESULTS_POST />
    </ContentViewer>
  );
};

export default SearchArtContent;
