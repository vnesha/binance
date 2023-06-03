"use client";
import { usePositionData } from "../hooks/usePositionData";
import { CombinedDataType } from "../types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionHeader } from "@/components/positionHeader";
import { OrderForm } from "@/components/orderForm";
import PositionDataRow from "@/components/positionDataRow";
import AdvancedChart from "@/components/AdvancedChart";

// tailwindcss: text-green text-red bg-green bg-red

function CryptoPage() {
  const { combinedData, isLoading, perpetualSymbols, baseAssetAll } =
    usePositionData();
  const filteredPositions = combinedData?.filter(
    (position: CombinedDataType) => position.positionAmt !== 0
  );

  return (
    <div>
      <div className="flex">
        <div className="w-full">
          <AdvancedChart />
        </div>
        <div className="flex w-[255px] bg-black">
          <OrderForm
            perpetualSymbols={perpetualSymbols}
            baseAssetAll={baseAssetAll}
          />
        </div>
      </div>
      <div className="pl-4 pr-4">
        <Tabs defaultValue="position">
          <TabsList>
            <TabsTrigger value="position">{`Positions(${filteredPositions?.length})`}</TabsTrigger>
            <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="position">
            <div className="table w-full">
              <PositionHeader />
              {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-yellow"></div>
                </div>
              ) : (
                combinedData?.map((data: CombinedDataType, index: number) => (
                  <PositionDataRow key={index} data={data} index={index} />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="open-orders">
            <PositionHeader />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CryptoPage;
