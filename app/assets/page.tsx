"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatCurrency } from "@/lib/utils/format";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AssetsPage() {
  const { yearData, ageRangeStart, ageRangeEnd, config, updateConfig } =
    useSimulationStore();
  const { addToast } = useUIStore();

  const [isEditingInvestment, setIsEditingInvestment] = useState(false);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(
    config.investmentReturnRate
  );
  const [investmentStrategy, setInvestmentStrategy] = useState(
    config.investmentStrategy
  );
  const [investmentThreshold, setInvestmentThreshold] = useState(
    config.investmentThreshold
  );
  const [investmentRatio, setInvestmentRatio] = useState(config.investmentRatio);

  const filteredData = yearData.filter(
    (data) => data.age >= ageRangeStart && data.age <= ageRangeEnd
  );

  // Get latest data
  const latestData = filteredData[filteredData.length - 1];

  // Prepare chart data for asset growth
  const assetGrowthData = filteredData.map((data) => ({
    age: data.age,
    現金: data.cash,
    投資: data.investment,
    不動産: data.propertyValue,
    総資産: data.totalAssets,
  }));

  // Prepare pie chart data (latest year)
  const assetCompositionData = latestData
    ? [
        { name: "現金", value: latestData.cash },
        { name: "投資資産", value: latestData.investment },
        { name: "不動産", value: latestData.propertyValue },
      ].filter((item) => item.value > 0)
    : [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const handleSaveInvestmentSettings = () => {
    updateConfig({
      investmentReturnRate,
      investmentStrategy,
      investmentThreshold,
      investmentRatio,
    });
    addToast("投資設定を更新しました", "success");
    setIsEditingInvestment(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          金融資産
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          資産の内訳と推移の詳細
        </p>
      </div>

      {/* Summary Cards */}
      {latestData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="md">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">総資産</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(latestData.totalAssets)}
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">現金</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(latestData.cash)}
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                投資資産
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(latestData.investment)}
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">不動産</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(latestData.propertyValue)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Investment Settings */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            投資設定
          </h2>
          <Button
            variant="secondary"
            onClick={() => setIsEditingInvestment(!isEditingInvestment)}
          >
            {isEditingInvestment ? "キャンセル" : "編集"}
          </Button>
        </div>

        {!isEditingInvestment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                想定年利
              </p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {(config.investmentReturnRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                投資戦略
              </p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {config.investmentStrategy === "threshold"
                  ? "閾値超過分を投資"
                  : config.investmentStrategy === "all"
                  ? "全額投資"
                  : "カスタム"}
              </p>
            </div>
            {config.investmentStrategy === "threshold" && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  現金閾値
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(config.investmentThreshold)}
                </p>
              </div>
            )}
            {config.investmentStrategy === "custom" && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  投資割合
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {(config.investmentRatio * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                想定年利（%）
              </label>
              <input
                type="number"
                step="0.1"
                value={investmentReturnRate * 100}
                onChange={(e) =>
                  setInvestmentReturnRate(parseFloat(e.target.value) / 100)
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                投資戦略
              </label>
              <select
                value={investmentStrategy}
                onChange={(e) =>
                  setInvestmentStrategy(e.target.value as any)
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="threshold">閾値超過分を投資</option>
                <option value="all">余剰全額を投資</option>
                <option value="custom">カスタム（割合指定）</option>
              </select>
            </div>

            {investmentStrategy === "threshold" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  現金閾値
                </label>
                <input
                  type="number"
                  value={investmentThreshold}
                  onChange={(e) =>
                    setInvestmentThreshold(parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  この金額を超える現金を投資に回します
                </p>
              </div>
            )}

            {investmentStrategy === "custom" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  投資割合（%）
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={investmentRatio * 100}
                  onChange={(e) =>
                    setInvestmentRatio(parseFloat(e.target.value) / 100)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  余剰資金のこの割合を投資に回します
                </p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleSaveInvestmentSettings}
              className="w-full"
            >
              設定を保存
            </Button>
          </div>
        )}
      </Card>

      {/* Asset Growth Chart */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          資産推移
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={assetGrowthData}>
            <defs>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="age"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              label={{ value: "年齢", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f1f5f9" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="現金"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#colorCash)"
            />
            <Area
              type="monotone"
              dataKey="投資"
              stackId="1"
              stroke="#10b981"
              fill="url(#colorInvestment)"
            />
            <Area
              type="monotone"
              dataKey="不動産"
              stackId="1"
              stroke="#f59e0b"
              fill="url(#colorProperty)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Asset Composition */}
      {latestData && assetCompositionData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              資産構成（{latestData.age}歳時点）
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetCompositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetCompositionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              資産詳細
            </h2>
            <div className="space-y-4">
              {assetCompositionData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {((item.value / latestData.totalAssets) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    総資産
                  </span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {formatCurrency(latestData.totalAssets)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          データがありません。設定ページで初期値を設定してください。
        </div>
      )}
    </div>
  );
}
