import { Background, PopupWrapper } from ".";
import PrimaryButton from "../Button/PrimaryButton";

type SuccessProps = {
  title: string;
  desc?: string;
  buttonText?: string;
  onConfirm?: () => void;
  noBg?: boolean;
};

const Success = ({
  title,
  desc,
  buttonText = "Ux",
  onConfirm,
  noBg = false,
}: SuccessProps) => {
  return (
    <Background onClick={() => onConfirm && onConfirm()} noBg={noBg}>
      <PopupWrapper>
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-4 font-bold text-lg text-gray-800">{title}</h1>
        {desc && <p className="text-gray-600 mb-6">{desc}</p>}
        {buttonText && <PrimaryButton text={buttonText} onClick={onConfirm} />}
      </PopupWrapper>
    </Background>
  );
};

export default Success;
