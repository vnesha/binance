"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Switch } from "@/components/ui/switch";
import TextInputField from "@/components/textInputField";
import "react-toastify/dist/ReactToastify.css";

export default function TradeSettings() {
  const [riskPercent, setRiskPercent] = useState("0");
  const [riskRewardRatio, setRiskRewardRatio] = useState("0");
  const [openPositionLimit, setOpenPositionLimit] = useState("0");
  const [isAutoTrading, setIsAutoTrading] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const response = await fetch("/api/get-settings");
      if (response.ok) {
        const settings = await response.json();
        setRiskPercent(String(settings.riskPercent));
        setRiskRewardRatio(String(settings.riskRewardRatio));
        setOpenPositionLimit(String(settings.openPositionLimit));
        setIsAutoTrading(settings.autoTrading);
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
        <div className="mb-1 mt-6 flex flex-row items-center justify-between text-sm text-gray-lighter">
          <div>Auto Trading</div>
          <div className="flex items-center">
            <Switch
              checked={isAutoTrading}
              onCheckedChange={setIsAutoTrading}
            />{" "}
          </div>
        </div>
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
        />
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
