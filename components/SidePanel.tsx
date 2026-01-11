"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { HousePurchase } from "@/lib/types";

type PanelTab = "income" | "expense" | "investment" | "house" | "config";

export default function SidePanel() {
  const {
    selectedAge,
    setSelectedAge,
    yearData,
    config,
    updateConfig,
    updateYearData,
    setHousePurchase,
    housePurchase,
    exportData,
    importData,
  } = useSimulationStore();

  const [activeTab, setActiveTab] = useState<PanelTab>("income");
  const [importText, setImportText] = useState("");

  if (!selectedAge) {
    return (
      <div className="w-96 bg-gray-100 border-l border-gray-300 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          年齢を選択して<br />データを編集
        </p>
      </div>
    );
  }

  const currentData = yearData.find((d) => d.age === selectedAge);
  if (!currentData) return null;

  const tabs: { id: PanelTab; label: string }[] = [
    { id: "income", label: "収入" },
    { id: "expense", label: "支出" },
    { id: "investment", label: "投資" },
    { id: "house", label: "住宅" },
    { id: "config", label: "設定" },
  ];

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asset-simulation-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importText) {
      importData(importText);
      setImportText("");
      alert("データをインポートしました");
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-300 flex flex-col h-screen overflow-hidden">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800">{selectedAge}歳の編集</h2>
          <button
            onClick={() => setSelectedAge(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-3 py-2 text-xs font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "income" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                給与（額面）
              </label>
              <input
                type="number"
                value={currentData.salary || ""}
                onChange={(e) =>
                  updateYearData(selectedAge, {
                    salary: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="ルールから自動計算"
              />
              <p className="text-xs text-gray-500 mt-1">
                空欄でルールベース（ベース給与 × 成長率）
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">額面</span>
                <span className="font-semibold">{formatCurrency(currentData.grossIncome)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>所得税</span>
                <span>-{formatCurrency(currentData.incomeTax)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>住民税</span>
                <span>-{formatCurrency(currentData.residentTax)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>社会保険料</span>
                <span>-{formatCurrency(currentData.socialInsurance)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                <span>手取り</span>
                <span className="text-green-600">{formatCurrency(currentData.netIncome)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expense" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生活費
              </label>
              <input
                type="number"
                value={currentData.livingCost || ""}
                onChange={(e) =>
                  updateYearData(selectedAge, {
                    livingCost: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="ルールから自動計算"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                娯楽費（旅行など）
              </label>
              <input
                type="number"
                value={currentData.entertainmentCost}
                onChange={(e) =>
                  updateYearData(selectedAge, {
                    entertainmentCost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {currentData.mortgagePayment > 0 && (
              <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
                <div className="font-medium text-gray-700">住宅ローン</div>
                <div className="flex justify-between">
                  <span className="text-gray-600">年間返済額</span>
                  <span className="text-red-600">{formatCurrency(currentData.mortgagePayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">うち利息</span>
                  <span>{formatCurrency(currentData.mortgageInterest)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">うち元金</span>
                  <span>{formatCurrency(currentData.mortgagePrincipal)}</span>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
              <div className="flex justify-between font-bold">
                <span>総支出</span>
                <span className="text-red-600">{formatCurrency(currentData.totalExpense)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "investment" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                積立投資額（NISA等）
              </label>
              <input
                type="number"
                value={currentData.investmentContribution}
                onChange={(e) =>
                  updateYearData(selectedAge, {
                    investmentContribution: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">現金残高</span>
                <span className="font-semibold">{formatCurrency(currentData.cash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">投資資産</span>
                <span className="font-semibold">{formatCurrency(currentData.investment)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>金融資産合計</span>
                <span className="text-purple-600">
                  {formatCurrency(currentData.cash + currentData.investment)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "house" && (
          <div className="space-y-4">
            {!housePurchase ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">住宅購入イベントを設定</p>
                <button
                  onClick={() => {
                    const purchase: HousePurchase = {
                      age: selectedAge,
                      propertyPrice: 50_000_000,
                      downPayment: 10_000_000,
                      loanAmount: 40_000_000,
                      interestRate: 0.015,
                      loanTerm: 35,
                      acquisitionCostRate: 0.07,
                      propertyTaxRate: 0.014,
                      annualMaintenanceCost: 100_000,
                      propertyAppreciationRate: 0,
                    };
                    setHousePurchase(purchase);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  住宅購入を設定
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    購入年齢
                  </label>
                  <input
                    type="number"
                    value={housePurchase.age}
                    onChange={(e) =>
                      setHousePurchase({
                        ...housePurchase,
                        age: parseInt(e.target.value) || selectedAge,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物件価格
                  </label>
                  <input
                    type="number"
                    value={housePurchase.propertyPrice}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setHousePurchase({
                        ...housePurchase,
                        propertyPrice: price,
                        loanAmount: price - housePurchase.downPayment,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    頭金
                  </label>
                  <input
                    type="number"
                    value={housePurchase.downPayment}
                    onChange={(e) => {
                      const down = parseFloat(e.target.value) || 0;
                      setHousePurchase({
                        ...housePurchase,
                        downPayment: down,
                        loanAmount: housePurchase.propertyPrice - down,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年利（%）
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={housePurchase.interestRate * 100}
                    onChange={(e) =>
                      setHousePurchase({
                        ...housePurchase,
                        interestRate: (parseFloat(e.target.value) || 0) / 100,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    返済期間（年）
                  </label>
                  <input
                    type="number"
                    value={housePurchase.loanTerm}
                    onChange={(e) =>
                      setHousePurchase({
                        ...housePurchase,
                        loanTerm: parseInt(e.target.value) || 35,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={() => setHousePurchase(null)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                >
                  住宅購入をキャンセル
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ベース年収（額面）
              </label>
              <input
                type="number"
                value={config.baseSalary}
                onChange={(e) =>
                  updateConfig({ baseSalary: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                給与成長率（%/年）
              </label>
              <input
                type="number"
                step="0.1"
                value={config.salaryGrowthRate * 100}
                onChange={(e) =>
                  updateConfig({
                    salaryGrowthRate: (parseFloat(e.target.value) || 0) / 100,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ベース生活費
              </label>
              <input
                type="number"
                value={config.baseLivingCost}
                onChange={(e) =>
                  updateConfig({ baseLivingCost: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                投資年率利回り（%）
              </label>
              <input
                type="number"
                step="0.1"
                value={config.investmentReturnRate * 100}
                onChange={(e) =>
                  updateConfig({
                    investmentReturnRate: (parseFloat(e.target.value) || 0) / 100,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                現金閾値
              </label>
              <input
                type="number"
                value={config.investmentThreshold}
                onChange={(e) =>
                  updateConfig({
                    investmentThreshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                投資戦略
              </label>
              <select
                value={config.investmentStrategy}
                onChange={(e) =>
                  updateConfig({
                    investmentStrategy: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="threshold">閾値超過分のみ投資</option>
                <option value="all">収支プラス全額投資</option>
                <option value="custom">任意割合</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <button
                onClick={handleExport}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                JSONエクスポート
              </button>
              <div>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="JSONを貼り付け"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs h-20"
                />
                <button
                  onClick={handleImport}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm mt-2"
                >
                  JSONインポート
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
