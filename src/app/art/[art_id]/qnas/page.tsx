import BottomButton from "@/components/BottomButton";
import Content from "./content";
import { FAKE_QNA_DATAS } from "@/types/Qna";

const Qnas = async () => {
  return (
    <>
      <Content qnas={FAKE_QNA_DATAS} />
      <BottomButton>판매자에게 문의하기</BottomButton>
    </>
  );
};

export default Qnas;
