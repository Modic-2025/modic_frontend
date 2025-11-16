import Image from "next/image";

const TemplateLoading = ({ title }: { title: string }) => (
  <div className="flex flex-col w-full h-full justify-center items-center">
    <Image
      src="/MODIC.svg"
      alt="MODIC"
      width={180}
      height={100}
      className="motion-preset-blink motion-duration-1000 [--motion-loop-opacity:0.6]"
    />
    <h1 className="text-(--color-gray-4) font-bold text-xl mt-4">{title}</h1>
  </div>
);

export default TemplateLoading;
