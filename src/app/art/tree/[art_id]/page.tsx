import getPostDerivedTree, { TypeTreeItem } from "@/APIs/Art/tree";
import TreeContent from "./content";
import { APIFailureMsg } from "@/APIs";

type TreeProp = {
  art_id: number;
};
const TreePage = async ({ params }: { params: Promise<TreeProp> }) => {
  const { art_id } = await params;
  const treeData: APIFailureMsg | TypeTreeItem[] =
    await getPostDerivedTree(art_id);

  if (!Array.isArray(treeData)) {
    return (
      <>
        {treeData.title} ({treeData.code})
      </>
    );
  }

  return <TreeContent data={treeData} />;
};

export default TreePage;
