"use client";
import Image from "next/image";
import { commonClassNames } from "../..";
import { useCoinBalance } from "@/APIs/user/coins/hook";
import { useEffect, useState } from "react";

const COIN_THESHOLD = 10000;
const checkDisplayOverflow = (coins: number) => {
  if (COIN_THESHOLD <= coins) return true;
  return false;
};
const Coins = ({ onClick }: { onClick?: () => void }) => {
  const { coinBalance, isLoading, error } = useCoinBalance();
  const [isSoManyCoins, setSoManyCoins] = useState<boolean>(
    typeof coinBalance === "number" && checkDisplayOverflow(coinBalance)
  );
  useEffect(() => {
    if (typeof coinBalance === "number") {
      setSoManyCoins(checkDisplayOverflow(coinBalance));
    }
  }, [coinBalance]);
  console.log("error :>> ", error);

  return isLoading || error ? (
    <></>
  ) : (
    <div
      className={`${commonClassNames} basis-1/6 ml-auto inline-flex items-center text-sm font-bold`}
      onClick={onClick ? onClick : () => {}}
    >
      <span className="inline-flex items-center gap-1 ml-auto">
        <Image
          src="/Coin.svg"
          alt="back"
          className="ml-auto"
          width={18}
          height={18}
        />
        <span className="max-w-16 whitespace-nowrap overflow-hidden">
          {coinBalance}
        </span>
        {isSoManyCoins && <span>+</span>}
        <span>개</span>
      </span>
    </div>
  );
};

export default Coins;
