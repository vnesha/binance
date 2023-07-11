"use client";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SwitchOption } from "@/components/SwitchOption";
import TextInputField from "@/components/textInputField";
import { SelectSymbol } from "@/components/selectSymbolSettings";
// import { usePositionData } from "@/hooks/useAllPositionData";
import TextArea from "@/components/textAreaField";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type SettingsData = {
  riskPercent: number;
  riskRewardRatio: number;
  openPositionLimit: number;
  autoTrading: boolean;
  tralingTP: boolean;
  tralingTPLimit: number;
  tralingTPDeviation: number;
  PnL: number;
  excludedSymbols: string[];
};

const fetchSettings = async (): Promise<SettingsData> => {
  const response = await axios.get<SettingsData>("/api/get-settings/");
  return response.data;
};

export default function TradeSettings() {
  const [riskPercent, setRiskPercent] = useState<string>("0");
  const [riskRewardRatio, setRiskRewardRatio] = useState<string>("0");
  const [openPositionLimit, setOpenPositionLimit] = useState<string>("0");
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [isTralingTP, setIsTralingTP] = useState(false);
  const [tralingTPLimit, setTralingTPLimit] = useState<string>("0");
  const [tralingTPDeviation, setTralingTPDeviation] = useState<string>("0");
  const [PnL, setPnL] = useState<string>("0");
  const [excludedSymbols, setExcludedSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("Select Symbol");
  // const { perpetualSymbols } = usePositionData();
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

  const { data, isLoading, error, refetch } = useQuery(
    ["settings"],
    fetchSettings
  );

  useEffect(() => {
    if (data) {
      const settings: SettingsData = data;
      setRiskPercent(settings.riskPercent.toString());
      setRiskRewardRatio(settings.riskRewardRatio.toString());
      setOpenPositionLimit(settings.openPositionLimit.toString());
      setIsAutoTrading(settings.autoTrading);
      setIsTralingTP(settings.tralingTP);
      setTralingTPLimit(settings.tralingTPLimit.toString());
      setTralingTPDeviation(settings.tralingTPDeviation.toString());
      setPnL(settings.PnL.toString());
      setExcludedSymbols(settings.excludedSymbols);
    }
  }, [data]);

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
        PnL,
        excludedSymbols: excludedSymbols.filter((symbol) => symbol !== ""),
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred.</div>;
  }

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
              extraText="Clear list"
              label="Excluded Symbols"
              name="excludedSymbols"
              disabled={!isAutoTrading || !isTralingTP}
              value={
                excludedSymbols.length > 0 ? excludedSymbols.join(", ") : ""
              }
              onChange={(event) => {
                const value = event.target.value.trim();

                if (value === "" || value.includes(",")) {
                  const symbols = value
                    .split(",")
                    .map((symbol) => symbol.trim())
                    .filter((symbol) => symbol !== "");

                  setExcludedSymbols(symbols);
                }
              }}
              onExtraTextClick={() => {
                setExcludedSymbols([]);
                setSelectedSymbol("Select Symbol");
              }}
              handleSelectSymbol={handleSelect}
            />
          </div>
          <div className="mt-1 flex items-baseline">
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
      <input
        type="number"
        value={PnL}
        onChange={(event) => {
          const value = event.target.value;
          if (value.length <= 4) {
            setPnL(value);
          }
        }}
      />
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
