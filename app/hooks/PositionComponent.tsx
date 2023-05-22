"use client";
import { useState } from "react";
import { useStreamMarketPrice } from "./useStreamMarketPrice";

type AccountType = {
  asset: string;
  symbol: string;
};

type PositionType = {
  symbol: string;
  positionAmt: string;
  markPrice?: string; // Ako postoji, dodajte ga ovde
};

type PositionComponentProps = {
  symbol: string;
  filteredPositions: PositionType[];
  filteredAccount: AccountType[];
};

export const PositionComponent: React.FC<PositionComponentProps> = ({
  symbol,
  filteredPositions,
  filteredAccount,
}) => {
  const [livePrices, setLivePrices] = useState<{
    [symbol: string]: number | null;
  }>({});

  const updateLivePrice = (symbol: string, price: number) => {
    setLivePrices((prevPrices) => ({ ...prevPrices, [symbol]: price }));
  };

  useStreamMarketPrice(symbol, updateLivePrice);

  const combinedData = filteredAccount?.map((account: AccountType) => {
    const positionData = filteredPositions?.find(
      (position: PositionType) => position.symbol === account.symbol
    );

    const marketPrice = livePrices[symbol];
    const markPrice = positionData?.markPrice; // Pod pretpostavkom da "markPrice" dolazi sa "PositionType"

    return {
      ...account,
      ...positionData,
      marketPrice: marketPrice ?? markPrice,
    };
  });

  return (
    <div>
      {combinedData?.map((data, index) => (
        <div key={index}>
          <h3>Symbol: {data.symbol}</h3>
          <p>Market Price: {data.marketPrice}</p>
          {/* dodajte ostale podatke koje želite prikazati */}
        </div>
      ))}
    </div>
  );
};

export default PositionComponent;
