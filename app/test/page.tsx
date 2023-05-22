"use client";
import { usePositionData } from "../hooks/usePositionData";

type CombinedDataType = {
  symbol: string;
  positionAmt: string;
  price: string;
  positionSymbol: string;
  livePrice: string | null;
  initialMargin?: string;
  unrealizedProfit: number;
};

function Test() {
  const { combinedData } = usePositionData();

  return (
    <div>
      {combinedData?.map((data: CombinedDataType) => (
        <div key={data.symbol}>
          <h3>Symbol: {data.symbol}</h3>
          <p>Initial Margin: {data.initialMargin}</p>
          <p>Position Amount: {data.positionAmt}</p>
          <p>Live Price: {data.livePrice}</p>
          <p>Live Price: {data.unrealizedProfit}</p>
        </div>
      ))}
    </div>
  );
}

export default Test;
