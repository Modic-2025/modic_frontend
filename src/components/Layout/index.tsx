import Image from "next/image";

export const CenteredLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-full justify-center gap-4 text-center">
    {children}
  </div>
);

export const AlertForm = ({
  src,
  alt,
  title,
  desc,
}: {
  src: string;
  alt?: string;
  title: string;
  desc?: string;
}) => (
  <>
    <section>
      <Image
        src={src}
        alt={alt || src}
        width="100"
        height="100"
        className="m-auto"
      />
    </section>
    <section className="text-2xl font-bold">{title}</section>
    {desc && (
      <section className="font-bold text-(--color-gray-4)">{desc}</section>
    )}
  </>
);
