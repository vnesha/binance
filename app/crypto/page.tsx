"use client";
import { useState, useEffect, Fragment } from "react";
import { useCryptoPositions } from "../hooks/usePositions";
import { useAccount } from "../hooks/useAccount";
import { useExchangeInfo } from "../hooks/useExchangeInfo";
import PositionRow from "@/components/positionRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionHeader } from "@/components/positionHeader";

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
  const [priceUpdate] = useState<{
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
      <Tabs defaultValue="position">
        <TabsList>
          <TabsTrigger value="position">{`Positions(${filteredPositions.length})`}</TabsTrigger>
          <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="position">
          <div className="table w-full">
            <PositionHeader />
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
        </TabsContent>
        <TabsContent value="open-orders">
          <PositionHeader />
          empty
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Crypto;
