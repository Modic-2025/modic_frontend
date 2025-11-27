import { Suspense } from "react";
import SearchClient from "./SearchClient"; // 위에서 만든 컴포넌트 import

// ✅ 핵심: 여기서 동적 렌더링을 강제합니다. (Server Component이기에 가능)
export const dynamic = "force-dynamic";

const SearchPage = () => {
  return (
    // Client Component를 Suspense로 감싸줍니다.
    <Suspense fallback={<div>Loading...</div>}>
      <SearchClient />
    </Suspense>
  );
};

export default SearchPage;
