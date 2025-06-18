import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="header-left">
      <Link href="/art">
        <Image
          src="/MODIC.svg"
          alt="MODIC"
          layout="relative"
          width={140}
          height={32}
        />
      </Link>
    </div>
  );
};

export default Logo;
