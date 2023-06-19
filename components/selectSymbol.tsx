import { usePositionData } from "@/app/hooks/useAllPositionData";
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
}

export function SelectSymbol({
  selectedSymbol,
  handleSelect,
  placeholder,
}: selectSymbolProps) {
  const { perpetualSymbols } = usePositionData();

  return (
    <Select onValueChange={handleSelect} value={selectedSymbol || undefined}>
      <SelectTrigger className="text-gray-lighter">
        <SelectValue placeholder={placeholder}>{selectedSymbol}</SelectValue>
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
      <div className="m-0 p-0 text-sm font-medium text-gray-lighter">
        Perpetual
      </div>
    </Select>
  );
}
