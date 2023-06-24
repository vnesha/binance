"use client";
import { useState, useEffect } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { CombinedDataType } from "@/app/types/types";
import { formatLocale } from "@/util/formatingNumber";

export default function AccountInfo({ className }: { className?: string }) {
  const { combinedData } = usePositionData();
  const [totalUnrealizedProfit, setTotalUnrealizedProfit] = useState<
    number | null
  >(0);
  const [totalMargin, setTotalMargin] = useState<number | null>(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    if (combinedData.length > 0) {
      const totalProfit = combinedData.reduce(
        (acc: number, position: CombinedDataType) =>
          acc + position.unrealizedProfit,
        0
      );
      const totalMargin = combinedData.reduce(
        (acc: number, position: CombinedDataType) => acc + position.margin,
        0
      );
      const balance = combinedData[0].walletBalance;

      setTotalUnrealizedProfit(totalProfit);
      setTotalMargin(totalMargin);
      setWalletBalance(balance);
    }
  }, [combinedData]);

  const formattedWalletBalance =
    walletBalance !== null
      ? parseFloat(walletBalance.toString()).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " USDT"
      : "0.00 USDT";

  const availableBalance =
    walletBalance !== null &&
    totalUnrealizedProfit !== null &&
    totalMargin !== null
      ? totalUnrealizedProfit >= 0
        ? walletBalance - totalMargin + Math.abs(totalUnrealizedProfit)
        : walletBalance - Math.abs(totalUnrealizedProfit) - totalMargin
      : 0;

  const totalBalance =
    walletBalance !== null &&
    totalUnrealizedProfit !== null &&
    totalMargin !== null
      ? totalUnrealizedProfit >= 0
        ? availableBalance + totalMargin
        : walletBalance - Math.abs(totalUnrealizedProfit)
      : 0;

  return (
    <div className={className}>
      <div className="mb-4 text-sm font-bold text-gray-lighter">
        USDⓈ-M Account
      </div>
      <div className="mb-2 flex items-center justify-between text-gray-lighter">
        <div className="font-bold">Total Balance</div>
        <div className="font-bold">{formatLocale(totalBalance)}</div>
      </div>
      <div className="flex items-center justify-between">
        <div>Wallet Balance</div>
        <div className="font-bold text-gray-lighter">
          {formattedWalletBalance}
        </div>
      </div>
      <div className="mb-[2px] flex items-center justify-between pt-[2px]">
        <div>Available Balance</div>
        <div className="font-bold text-gray-lighter">
          {availableBalance !== null ? formatLocale(availableBalance) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>Total Unrealized PNL</div>
        <div className="font-bold text-gray-lighter">
          {totalUnrealizedProfit !== null
            ? formatLocale(totalUnrealizedProfit)
            : null}
        </div>
      </div>
      {/* <div>
        Margin: {totalMargin !== null ? formatLocale(totalMargin) : null}
      </div> */}
    </div>
  );
}
