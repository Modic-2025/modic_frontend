import { APIFailureMsg } from "@/APIs";
import GetGeneratedImages, {
  RESPONSE_BODY_TYPE,
} from "@/APIs/ai/images/my-generated";
import Content from "./content";

// API parameters
const INIT_PAGE = 0;
const INIT_SIZE = 20;

const Page = async () => {
  const genImagesInfo: RESPONSE_BODY_TYPE | APIFailureMsg =
    await GetGeneratedImages(INIT_PAGE, INIT_SIZE);
  const isError = "code" in genImagesInfo;
  // Error exception
  if (isError) {
    const { code, title } = genImagesInfo;
    return (
      <>
        {title} ({code})
      </>
    );
  }

  return <Content {...genImagesInfo} />;
};

export default Page;
