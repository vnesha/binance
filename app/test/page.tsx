"use client";
import { useState } from "react";

export default function Home() {
  const [riskPercent, setRiskPercent] = useState(0);
  const [riskRewardRatio, setRiskRewardRatio] = useState(0);

  const handleSave = async () => {
    const response = await fetch("/api/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        riskPercent,
        riskRewardRatio,
      }),
    });

    if (response.ok) {
      console.log("Settings saved successfully");
      setRiskPercent(0);
      setRiskRewardRatio(0);
    } else {
      console.error("Error saving settings");
    }
  };

  return (
    <div>
      <label>
        Risk Percent:
        <input
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
        />
      </label>

      <label>
        Risk Reward Ratio:
        <input
          type="number"
          value={riskRewardRatio}
          onChange={(e) => setRiskRewardRatio(parseFloat(e.target.value))}
        />
      </label>

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
