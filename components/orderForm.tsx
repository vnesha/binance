import { useState, useEffect } from "react";
import { OpenOrder } from "@/components/buttonOpenOrder";

export const OrderForm = ({
  perpetualSymbols,
}: {
  perpetualSymbols: string[];
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (perpetualSymbols.length > 0) {
      setSelectedSymbol(perpetualSymbols[0]);
    }
  }, [perpetualSymbols]);

  const handleChange = (event: any) => {
    setSelectedSymbol(event.target.value);
  };

  const handleQuantityChange = (event: any) => {
    setQuantity(Number(event.target.value));
  };

  const handleSubmit = () => {
    // Logika za obradu forme
    //console.log("Symbol:", selectedSymbol);
    //console.log("Quantity:", quantity);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select a symbol:
        <select value={selectedSymbol} onChange={handleChange}>
          {perpetualSymbols.map((symbol: string) => (
            <option value={symbol} key={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </label>
      <label>
        Enter quantity:
        <input type="number" value={quantity} onChange={handleQuantityChange} />
      </label>
      <OpenOrder
        symbol={selectedSymbol}
        quantity={quantity}
        handleSubmit={handleSubmit}
      />
    </form>
  );
};
