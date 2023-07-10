"use client";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SwitchOption } from "@/components/SwitchOption";
import TextInputField from "@/components/textInputField";
import { SelectSymbol } from "@/components/selectSymbolSettings";
import { usePositionData } from "@/hooks/useAllPositionData";
import TextArea from "@/components/textAreaField";
import "react-toastify/dist/ReactToastify.css";

export default function TradeSettings() {
  const [riskPercent, setRiskPercent] = useState("0");
  const [riskRewardRatio, setRiskRewardRatio] = useState("0");
  const [openPositionLimit, setOpenPositionLimit] = useState("0");
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [isTralingTP, setIsTralingTP] = useState(false);
  const [tralingTPLimit, setTralingTPLimit] = useState("0");
  const [tralingTPDeviation, setTralingTPDeviation] = useState("0");
  const [excludedSymbols, setExcludedSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("Select Symbol");
  const { perpetualSymbols } = usePositionData();
  const [placeholder] = useState<string | null>("Select Symbol");

  const handleSelect = useCallback(
    (symbol: string) => {
      // Check if the selected symbol is empty
      if (symbol.trim() === "") {
        return;
      }

      setSelectedSymbol(symbol);

      // Check if the selected symbol is already in the excluded list
      if (!excludedSymbols.includes(symbol)) {
        // Add the selected symbol to the excluded list
        setExcludedSymbols((prevSymbols) => [...prevSymbols, symbol]);
      }
    },
    [setSelectedSymbol, excludedSymbols]
  );

  useEffect(() => {
    if (selectedSymbol === "" && perpetualSymbols.length > 0) {
      setSelectedSymbol(perpetualSymbols[0]);
    }
  }, [selectedSymbol, perpetualSymbols]);

  useEffect(() => {
    async function fetchSettings() {
      const response = await fetch("/api/get-settings");
      if (response.ok) {
        const settings = await response.json();
        setRiskPercent(String(settings.riskPercent));
        setRiskRewardRatio(String(settings.riskRewardRatio));
        setOpenPositionLimit(String(settings.openPositionLimit));
        setIsAutoTrading(settings.autoTrading);
        setIsTralingTP(settings.tralingTP);
        setTralingTPLimit(String(settings.tralingTPLimit));
        setTralingTPDeviation(String(settings.tralingTPDeviation));

        // Update excludedSymbols state from fetched settings
        setExcludedSymbols(settings.excludedSymbols);
      } else {
        console.error("Error fetching settings");
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const response = await fetch("/api/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        riskPercent,
        riskRewardRatio,
        openPositionLimit,
        autoTrading: isAutoTrading,
        tralingTP: isTralingTP,
        tralingTPLimit,
        tralingTPDeviation,
        excludedSymbols: excludedSymbols.filter((symbol) => symbol !== ""), // Ovde se vrši filtriranje praznih simbola
      }),
    });

    if (response.ok) {
      console.log("Settings saved successfully");
      toast.success("Settings saved successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      console.error("Error saving settings");
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <TextInputField
          type="number"
          label="Risk On Trade"
          sufix="%"
          className="w-[100%]"
          name="riskPrecent"
          value={riskPercent}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 4) {
              setRiskPercent(value);
            }
          }}
        />
        <TextInputField
          type="number"
          label="Risk Reward Ratio"
          className="w-[100%]"
          prefix="1:"
          sufix="RR"
          componentName="rr"
          name="riskRewardRatio"
          value={riskRewardRatio}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 2) {
              setRiskRewardRatio(value);
            }
          }}
        />
        <SwitchOption
          className="mt-4"
          name="Auto Trading"
          checked={isAutoTrading}
          onCheckedChange={setIsAutoTrading}
        />
        <TextInputField
          type="number"
          label="Open Position Limit"
          className="w-[100%]"
          name="openPositionLimit"
          value={openPositionLimit}
          disabled={!isAutoTrading}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 3) {
              setOpenPositionLimit(value);
            }
          }}
          // onBlur={handleSave}
        />
        <SwitchOption
          className="mt-4"
          name="Traling Take Profit"
          disabled={!isAutoTrading}
          checked={isTralingTP}
          onCheckedChange={setIsTralingTP}
        />
        <TextInputField
          type="number"
          label="Traling Take Profit Limit"
          className="w-[100%]"
          sufix="USDT"
          name="tralingTPLimit"
          value={tralingTPLimit}
          disabled={!isAutoTrading || !isTralingTP}
          onChange={(event) => {
            setTralingTPLimit(event.target.value);
          }}
        />
        <TextInputField
          type="number"
          label="Traling Take Profit Deviation"
          className="w-[100%]"
          sufix="%"
          name="tralingTPDeviation"
          value={tralingTPDeviation}
          disabled={!isAutoTrading || !isTralingTP}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 4) {
              setTralingTPDeviation(value);
            }
          }}
        />
        <div className="flex justify-between">
          <div className="mr-2 w-full">
            <TextArea
              label="Excluded Symbols"
              name="excludedSymbols"
              disabled={!isAutoTrading || !isTralingTP}
              value={
                excludedSymbols.length > 0 ? excludedSymbols.join(", ") : ""
              }
              onChange={(event) => {
                const value = event.target.value.trim();

                // Provera da li je tekst prazan ili sadrži simbole pre filtriranja
                if (value === "" || value.includes(",")) {
                  const symbols = value
                    .split(",")
                    .map((symbol) => symbol.trim())
                    .filter((symbol) => symbol !== "");

                  setExcludedSymbols(symbols);
                }
              }}
            />
          </div>
          <div className="flex items-center">
            <SelectSymbol
              disabled={!isAutoTrading || !isTralingTP}
              selectedSymbol={selectedSymbol || ""}
              handleSelect={handleSelect}
              placeholder={placeholder || ""}
            />
          </div>
        </div>
        <div className="flex flex-col"></div>
      </div>
      <button
        className="mt-6 w-full cursor-pointer rounded bg-yellow px-4 py-[10px] text-sm font-medium text-[#181a20] hover:bg-yellow/90"
        onClick={handleSave}
      >
        Save changes
      </button>
      <ToastContainer className={"text-sm"} newestOnTop />
    </div>
  );
}
