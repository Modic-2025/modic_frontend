import Image from "next/image";
import { Background, PopupWrapper } from ".";
import PrimaryButton from "../Button/PrimaryButton";
import SecondartButton from "../Button/SecondaryButton";

type ConfirmProps = {
  title: string;
  desc?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  noBg?: boolean;
};
const Confirm = ({
  title,
  desc,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  noBg = false,
}: ConfirmProps) => {
  return (
    <Background onClick={() => onCancel && onCancel()} noBg={noBg}>
      <PopupWrapper>
        <Image
          src="/warning.svg"
          alt="warning"
          className="mx-auto mb-6"
          width={84}
          height={84}
        />
        <h1 className="mb-4 font-bold text-lg font-[--color-gray-4]">
          {title}
        </h1>
        <p>{desc}</p>
        <p className="mb-6"></p>
        <PrimaryButton text={confirmText} onClick={onConfirm} />
        <p className="mb-2"></p>
        <SecondartButton text={cancelText} onClick={onCancel} />
      </PopupWrapper>
    </Background>
  );
};

export default Confirm;
