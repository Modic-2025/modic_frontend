import { useState } from "react";
import { Background } from "../Popups";
import Image from "next/image";

type ClickableImageType = {
  src: string;
  alt: string;
  fill?: boolean;
  layout?: string;
  width?: number;
  height?: number;
};
const ClickableImage = ({ ...rest }: ClickableImageType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {isOpen && (
        <Background onClick={() => setIsOpen(false)}>
          <Image
            {...rest}
            className="rounded-2xl motion-preset-expand motion-duration-300"
          />
        </Background>
      )}
      <Image {...rest} onClick={() => setIsOpen(true)} />
    </>
  );
};

export default ClickableImage;
