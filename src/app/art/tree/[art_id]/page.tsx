import getPostDerivedTree, { TypeTreeItem } from "@/APIs/Art/tree";
import TreeContent from "./content";
import { APIFailureMsg } from "@/APIs";

// const FAKE_TREE_DATA: TypeTreeItem[] = [
//   {
//     postId: 3,
//     title: "Mona Lisa- 레오나르도 다빈치",
//     parentPostId: null,
//     representativeImageUrl:
//       "https://cdn.modic.kr/post/98228981-d1ce-4444-9f48-8076ed93e9de?Expires=1761464906&Signature=yynuMSSMZiUvtUHnYyB0fSeAUY44wGSSKtvLjYJpkSuv1Vh4gsVq5tZ8oHNqloWI~0CRJPcMU19svYqKPlxqLI4iTqba12bD~i7UzJ-p0MT8CNA~rdxVZqLOsDJ8js1yAMsL4EnWXCfQqM7QWZsWjeIWIa-BcCL2CWFirmCFo8pZjc876chVGuSuAF4r0gPCxvN6-CuLru3h9Jg9f98ohClka82F0r8qhr0S04Y4KGrKnGHdOlpRMausworzNIk59fyAWJZyvBSUgQwUi85E5ACvpOTNyZ3mUDIqyajmo554rGPg2gvJS-mymtyAyCURKMUhVvxQOBrmIpSJHqLSSg__&Key-Pair-Id=K1QZP3Y49SA1WG",
//     postStatus: "ORIGINAL",
//   },
//   {
//     postId: 4,
//     title: "Mona Lisa- 레오나르도 다빈치 의 파생 포스트 1",
//     parentPostId: 3,
//     representativeImageUrl:
//       "https://cdn.modic.kr/generated-images/e6510bf6659e41ad82ed7fe7098e7078.png?Expires=1761464933&Signature=WnvHGBJtdA~1mzzSoOUfaqZTs~e9WFssWI1n9w8-NEB1nzlRNG5y0ribLbEz-aOulu7s0CAQmgvr~fPF7lk~zE72lA7gHaZaa~46oevKtqB2cZlLJIjGPhXR4wPUNg6AWsiAJLUwthr91~CFeCSeSecFOxYYxRruEGLEcHZUjBUGwE8nvX14neBQOvjAABxfJ3tgggqfAPbisLAkZgcC2bVpB5--FW5ud2NHBKC1jmltqtAnWqQfWdEGjf1kWWpSkwLvdMOUZxBX2sKi2AHGUwZzrN2snsEWtv1p3ZpZlExKAo1z-6g9wfqlHSTVBB0moviM4O2aPcIJUBrKTPoG5w__&Key-Pair-Id=K1QZP3Y49SA1WG",
//     postStatus: "DERIVED_PENDING",
//   },
//   {
//     postId: 5,
//     title: "Mona Lisa- 레오나르도 다빈치 의 파생 포스트 2",
//     parentPostId: 3,
//     representativeImageUrl:
//       "https://cdn.modic.kr/generated-images/e6510bf6659e41ad82ed7fe7098e7078.png?Expires=1761464933&Signature=WnvHGBJtdA~1mzzSoOUfaqZTs~e9WFssWI1n9w8-NEB1nzlRNG5y0ribLbEz-aOulu7s0CAQmgvr~fPF7lk~zE72lA7gHaZaa~46oevKtqB2cZlLJIjGPhXR4wPUNg6AWsiAJLUwthr91~CFeCSeSecFOxYYxRruEGLEcHZUjBUGwE8nvX14neBQOvjAABxfJ3tgggqfAPbisLAkZgcC2bVpB5--FW5ud2NHBKC1jmltqtAnWqQfWdEGjf1kWWpSkwLvdMOUZxBX2sKi2AHGUwZzrN2snsEWtv1p3ZpZlExKAo1z-6g9wfqlHSTVBB0moviM4O2aPcIJUBrKTPoG5w__&Key-Pair-Id=K1QZP3Y49SA1WG",
//     postStatus: "DERIVED_APPROVED",
//   },
//   {
//     postId: 6,
//     title: "Mona Lisa- 레오나르도 다빈치 의 파생 포스트 2의 파생 포스트",
//     parentPostId: 5,
//     representativeImageUrl:
//       "https://cdn.modic.kr/generated-images/e6510bf6659e41ad82ed7fe7098e7078.png?Expires=1761464933&Signature=WnvHGBJtdA~1mzzSoOUfaqZTs~e9WFssWI1n9w8-NEB1nzlRNG5y0ribLbEz-aOulu7s0CAQmgvr~fPF7lk~zE72lA7gHaZaa~46oevKtqB2cZlLJIjGPhXR4wPUNg6AWsiAJLUwthr91~CFeCSeSecFOxYYxRruEGLEcHZUjBUGwE8nvX14neBQOvjAABxfJ3tgggqfAPbisLAkZgcC2bVpB5--FW5ud2NHBKC1jmltqtAnWqQfWdEGjf1kWWpSkwLvdMOUZxBX2sKi2AHGUwZzrN2snsEWtv1p3ZpZlExKAo1z-6g9wfqlHSTVBB0moviM4O2aPcIJUBrKTPoG5w__&Key-Pair-Id=K1QZP3Y49SA1WG",
//     postStatus: "DERIVED_PENDING",
//   },
// ];

type TreeProp = {
  art_id: number;
};
const TreePage = async ({ params }: { params: TreeProp }) => {
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
