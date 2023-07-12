import { useState, useEffect } from "react";
import { usePositionData } from "@/hooks/useAllPositionData";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface selectSymbolProps {
  selectedSymbol: string;
  handleSelect: (symbol: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SelectSymbol({
  selectedSymbol,
  handleSelect,
  placeholder,
  disabled = false,
}: selectSymbolProps) {
  const { perpetualSymbols } = usePositionData();

  return (
    <div
      className={`flex-grow-1 whitespace-nowrap rounded bg-gray-middle px-4 py-[13px] ${
        disabled ? "bg-gray-middle/30" : ""
      }`}
    >
      <Select
        onValueChange={!disabled ? handleSelect : undefined}
        value={selectedSymbol || undefined}
      >
        <SelectTrigger
          className={`${
            disabled
              ? "cursor-default text-gray-lighter/20"
              : "text-gray-lighter"
          }`}
          disabled={disabled}
        >
          <SelectValue placeholder={placeholder}>
            {selectedSymbol ? selectedSymbol : "Select Symbol"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            {perpetualSymbols.map((symbol: string, index: number) => (
              <SelectItem value={symbol} key={`${symbol}-${index}`}>
                {symbol}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>

        <div
          className={`m-0 p-0 text-sm font-medium text-gray-lighter ${
            disabled ? "select-none text-gray-lighter/20" : ""
          }`}
        >
          Perpetual
        </div>
      </Select>
    </div>
  );
}
