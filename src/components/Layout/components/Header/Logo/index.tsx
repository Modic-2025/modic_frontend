import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="header-left">
      <Link href="/">
        <Image
          src="/MODIC.svg"
          alt="MODIC"
          layout="relative"
          width={106}
          height={36}
        />
      </Link>
    </div>
  );
};

export default Logo;
