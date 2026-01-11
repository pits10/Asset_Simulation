"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";

export default function Header() {
  const { yearData, config } = useSimulationStore();

  // 現在年齢のデータを取得
  const currentYearData = yearData.find((d) => d.age === config.currentAge);

  if (!currentYearData) {
    return null;
  }

  const kpis = [
    { label: "総資産", value: currentYearData.totalAssets, color: "text-blue-600" },
    { label: "純資産", value: currentYearData.netWorth, color: "text-green-600" },
    { label: "金融資産", value: currentYearData.cash + currentYearData.investment, color: "text-purple-600" },
    { label: "現金", value: currentYearData.cash, color: "text-gray-600" },
    { label: "投資資産", value: currentYearData.investment, color: "text-indigo-600" },
    { label: "負債", value: currentYearData.totalLiabilities, color: "text-red-600" },
    { label: "手取り", value: currentYearData.netIncome, color: "text-teal-600" },
    { label: "収支", value: currentYearData.cashFlow, color: currentYearData.cashFlow >= 0 ? "text-green-600" : "text-red-600" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          資産シミュレーション（{config.currentAge}歳）
        </h1>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
              <div className={`text-lg font-semibold ${kpi.color}`}>
                {formatCurrency(kpi.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
