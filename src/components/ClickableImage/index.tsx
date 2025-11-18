import { useState } from "react";
import { Background } from "../Popups";
import Image from "next/image";
import { preload } from "react-dom";

type ClickableImageType = {
  src: string;
  alt: string;
  fill?: boolean;
  layout?: string;
  width?: number;
  height?: number;
  className?: string;
};
const ClickableImage = ({ ...rest }: ClickableImageType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {isOpen && (
        <Background
          onClick={(e) => {
            setIsOpen(false);
            e?.stopPropagation();
          }}
        >
          <div className="max-w-84 max-h-[90%]">
            <Image
              {...rest}
              // fill
              layout="fill"
              width={undefined}
              height={undefined}
              onMouseEnter={() => preload(rest.src, { as: "image" })}
              className={`!relative rounded-2xl motion-preset-expand motion-duration-300`}
            />
          </div>
        </Background>
      )}
      <Image
        {...rest}
        onClick={(e) => {
          setIsOpen(true);
          e.stopPropagation();
        }}
        onMouseEnter={() => preload(rest.src, { as: "image" })}
        className={`cursor-pointer ${rest.className}`}
      />
    </>
  );
};

export default ClickableImage;
