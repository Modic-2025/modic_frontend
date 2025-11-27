import { AlertForm, CenteredLayout } from "@/components/Layout";
import SecessionContent from "./content";

const SecessionPage = () => {
  return (
    <CenteredLayout>
      <AlertForm
        title="정말 탈퇴하시겠습니까?"
        desc="계정의 모든 정보가 삭제되며, 되돌릴 수 없습니다."
      />
      <SecessionContent />
    </CenteredLayout>
  );
};

export default SecessionPage;
