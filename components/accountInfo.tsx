"use client";
import { useState, useEffect } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { CombinedDataType } from "@/app/types/types";
import { formatLocale } from "@/util/formatingNumber";

export default function AccountInfo() {
  const { combinedData } = usePositionData();
  const [totalUnrealizedProfit, setTotalUnrealizedProfit] = useState<
    number | null
  >(0);
  const [totalMargin, setTotalMargin] = useState<number | null>(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const formattedWalletBalance =
    walletBalance !== null
      ? parseFloat(walletBalance.toString()).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "USDT"
      : "0.00 USDT";

  const availableBalance =
    walletBalance !== null &&
    totalUnrealizedProfit !== null &&
    totalMargin !== null
      ? walletBalance - Math.abs(totalUnrealizedProfit) - totalMargin
      : 0;

  const totalBalance =
    walletBalance !== null && totalUnrealizedProfit !== null
      ? walletBalance - Math.abs(totalUnrealizedProfit)
      : 0;

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

  return (
    <div>
      {" "}
      <div className="mt-6 text-xs">
        Wallet Balance: {formattedWalletBalance}
      </div>
      <div className="mt-6 text-xs">
        Total Balance:{" "}
        {totalBalance !== null ? formatLocale(totalBalance) : null}
      </div>
      <div className="text-xs">
        PNL:{" "}
        {totalUnrealizedProfit !== null
          ? formatLocale(totalUnrealizedProfit)
          : null}
      </div>
      <div className="text-xs">
        Margin: {totalMargin !== null ? formatLocale(totalMargin) : null}
      </div>
      <div className="text-xs">
        Avbl:{" "}
        {availableBalance !== null ? formatLocale(availableBalance) : null}
      </div>
    </div>
  );
}
