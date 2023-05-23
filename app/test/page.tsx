"use client";
import React, { Fragment } from "react";
import { usePositionData } from "../hooks/usePositionData";
import { CombinedDataType } from "../types/types";
import PositionDataRow from "@/components/positionDataRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionHeader } from "@/components/positionHeader";

function Test() {
  const { combinedData, isLoading } = usePositionData();
  const filteredPositions = combinedData?.filter(
    (position: CombinedDataType) => position.positionAmt !== 0
  );

  return (
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin border-t-4 border-yellow h-16 w-16 rounded-full"></div>
              </div>
            ) : (
              combinedData?.map((data: CombinedDataType, index: number) => (
                <PositionDataRow
                  key={index}
                  data={data}
                  index={index}
                  isLoading={isLoading}
                />
              ))
            )}
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

export default Test;
