"use client";
import { usePositionData } from "../hooks/useAllPositionData";
import { CombinedDataType } from "../types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionHeader } from "@/components/headerPosition";
import { OrderForm } from "@/components/formOrder";
import { ToastContainer } from "react-toastify";
import { useOpenOrdersData } from "../hooks/useOpenOrdersData";
import PositionDataRow from "@/components/rowPositions";
import OrderDataRow from "@/components/rowOpenOrders";
import { Order } from "../types/types";
import { OpenOrdersHeaader } from "@/components/headerOpenOrders";
import AdvancedChart from "@/components/chartAdvanced";
import "react-toastify/dist/ReactToastify.css";
// tailwindcss: text-green text-red bg-green bg-red

function CryptoPage() {
  const {
    combinedData,
    isLoading,
    perpetualSymbols,
    baseAssetAll,
    exchangeInfo,
  } = usePositionData();
  const filteredPositions = combinedData?.filter(
    (position: CombinedDataType) => position.positionAmt !== 0
  );
  const { data: openOrders } = useOpenOrdersData();

  return (
    <div>
      <div className="flex">
        <div className="w-full">{/* <AdvancedChart /> */}</div>
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
            <TabsTrigger value="openOrders">{`Open Orders(${
              openOrders ? openOrders.length : 0
            })`}</TabsTrigger>
          </TabsList>
          <TabsContent value="position">
            <div className="table h-20 w-full">
              <PositionHeader dataIsEmpty={filteredPositions.length === 0} />
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
          <TabsContent value="openOrders">
            <div className="table h-20 w-full">
              <OpenOrdersHeaader dataIsEmpty={filteredPositions.length === 0} />
              {openOrders?.map((order: Order, index: number) => (
                <OrderDataRow
                  key={index}
                  order={order}
                  index={index}
                  exchangeInfo={exchangeInfo}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ToastContainer className={"text-sm"} newestOnTop />
    </div>
  );
}

export default CryptoPage;
