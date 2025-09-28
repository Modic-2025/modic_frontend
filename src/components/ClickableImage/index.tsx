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
  classname?: string;
};
const ClickableImage = ({ ...rest }: ClickableImageType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {isOpen && (
        <Background onClick={() => setIsOpen(false)}>
          <div className="max-w-84 max-h-[90%]">
            <Image
              {...rest}
              layout="fill"
              width={undefined}
              height={undefined}
              className={`!relative rounded-2xl motion-preset-expand motion-duration-300 ${rest.classname}`}
            />
          </div>
        </Background>
      )}
      <Image {...rest} onClick={() => setIsOpen(true)} />
    </>
  );
};

export default ClickableImage;
