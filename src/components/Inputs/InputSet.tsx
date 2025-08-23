// Title과 같이 랜더링 되는 input 컴포넌트 입니다.

import { FormInputProps } from ".";
import BlindInput from "./BlindInput";
import FormInput from "./FormInput";

// Inputs/InputSet, Inputs/BlindInput 을 사용합니다.
const InputSet = (
  props: FormInputProps & {
    title: string;
    inputLayout: "NORMAL" | "BLIND";
  }
) => {
  const inputLayout = props.inputLayout || "NORMAL";
  return (
    <>
      <label className="block text-md font-semibold mb-2">{props.title}</label>
      {inputLayout === "NORMAL" ? (
        <FormInput {...props} />
      ) : (
        <BlindInput {...props} />
      )}
    </>
  );
};

export default InputSet;
