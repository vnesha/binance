"use client";
import { useState, useEffect, Fragment } from "react";
import { useCryptoPositions } from "../hooks/usePositions";
import { useAccount } from "../hooks/useAccount";
import { useExchangeInfo } from "../hooks/useExchangeInfo";
import PositionRow from "../../components/positionRow";
// tailwindcss: text-green text-red bg-green bg-red

function Crypto() {
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useAccount();

  const {
    data: position,
    isLoading: positionLoading,
    error: positionError,
  } = useCryptoPositions();

  const {
    data: exchangeInfo,
    isLoading: exchangeInfoLoading,
    error: exchangeInfoError,
  } = useExchangeInfo();

  if (accountError || positionError || exchangeInfoError) {
    return (
      <div>
        An error has occurred:
        {accountError?.message || ""}
        {positionError?.message || ""}
        {exchangeInfo?.message || ""}
      </div>
    );
  }

  const [livePrices, setLivePrices] = useState({}); // to store live prices
  const [priceUpdate, setPriceUpdate] = useState<{
    symbol: string;
    price: number;
  } | null>(null);

  // handle price update
  useEffect(() => {
    if (priceUpdate) {
      setLivePrices((prices) => ({
        ...prices,
        [priceUpdate.symbol]: priceUpdate.price,
      }));
    }
  }, [priceUpdate]);

  // const handlePriceUpdate = useCallback((symbol, price) => {
  //   setPriceUpdate({ symbol, price });
  // }, []);

  if (positionLoading || accountLoading || exchangeInfoLoading) {
    return (
      <Fragment>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin border-t-4 border-yellow h-16 w-16 rounded-full"></div>
        </div>
      </Fragment>
    );
  }

  type PositionType = {
    positionAmt: number;
    symbol: string;
    position: string;
    // ostale vrednosti koje mogu postojati na `position` objektu
  };

  const filteredPositions = position.filter(
    (position: PositionType) => position.positionAmt != 0
  );

  return (
    <div className="pl-4 pr-4">
      <div className="tabs flex flex-row items-center h-10 ">
        <div className="font-medium text-sm text-yellow">{`Positions(${filteredPositions.length})`}</div>
        <div className="font-medium text-sm ml-4">Open Orders(1)</div>
      </div>
      <div className="sm: overflow-auto">
        <div className="table w-full">
          <div className="flex flex-row text-gray-light text-xs h-8 items-center">
            <div className="flex-grow flex-shrink-0 basis-28">Symbol</div>
            <div className="flex-grow flex-shrink-0 basis-20">Size</div>
            <div className="flex-grow flex-shrink-0 basis-20">Entry Price</div>
            <div className="flex-grow flex-shrink-0 basis-20">Mark Price</div>
            <div className="flex-grow flex-shrink-0 basis-20">Liq.Price</div>
            <div className="flex-grow flex-shrink-0 basis-20">Margin Ratio</div>
            <div className="flex-grow flex-shrink-0 basis-24">Margin</div>
            <div className="flex-grow flex-shrink-0 basis-20">PNL (ROE %)</div>
          </div>
          {position
            .filter((position: PositionType) => position.positionAmt != 0)
            .map((position: PositionType, index: number) => (
              <PositionRow
                key={position.symbol}
                position={position}
                index={index}
                livePrices={livePrices}
                account={account}
                exchangeInfo={exchangeInfo}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Crypto;
