// Title과 같이 랜더링 되는 input 컴포넌트 입니다.

import { FormInputProps } from ".";
import BlindInput from "./BlindInput";
import FormInput from "./FormInput";

// Inputs/InputSet, Inputs/BlindInput 을 사용합니다.
const InputSet = ({
  title,
  inputLayout = "NORMAL",
  ...rest
}: FormInputProps & {
  title: string;
  inputLayout: "NORMAL" | "BLIND";
}) => {
  return (
    <>
      <label className="block text-md font-semibold mb-2">{title}</label>
      {inputLayout === "NORMAL" ? (
        <FormInput {...rest} />
      ) : (
        <BlindInput {...rest} />
      )}
    </>
  );
};

export default InputSet;
