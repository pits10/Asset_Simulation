"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AssetsPage() {
  const { yearData, ageRangeStart, ageRangeEnd, config } = useSimulationStore();

  const displayData = useMemo(() => {
    return yearData.filter(
      (d) => d.age >= ageRangeStart && d.age <= ageRangeEnd
    );
  }, [yearData, ageRangeStart, ageRangeEnd]);

  const chartData = useMemo(() => {
    return displayData.map((d) => ({
      age: `${d.age}歳`,
      現金: d.cash,
      投資資産: d.investment,
      金融資産合計: d.cash + d.investment,
    }));
  }, [displayData]);

  const assetStats = useMemo(() => {
    if (displayData.length === 0) {
      return {
        currentCash: 0,
        currentInvestment: 0,
        totalAssets: 0,
        investmentRatio: 0,
        totalGrowth: 0,
        cagr: 0,
      };
    }

    const first = displayData[0];
    const last = displayData[displayData.length - 1];
    const initialAssets = first.cash + first.investment;
    const finalAssets = last.cash + last.investment;
    const years = displayData.length;

    const cagr =
      years > 1 && initialAssets > 0
        ? Math.pow(finalAssets / initialAssets, 1 / years) - 1
        : 0;

    return {
      currentCash: last.cash,
      currentInvestment: last.investment,
      totalAssets: finalAssets,
      investmentRatio:
        finalAssets > 0 ? last.investment / finalAssets : 0,
      totalGrowth: finalAssets - initialAssets,
      cagr,
    };
  }, [displayData]);

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
      <div className="grid grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            金融資産合計
          </p>
          <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {formatCurrency(assetStats.totalAssets)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            現金
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {formatCurrency(assetStats.currentCash)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            投資資産
          </p>
          <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {formatCurrency(assetStats.currentInvestment)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            投資比率
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {(assetStats.investmentRatio * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            資産成長額
          </p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              assetStats.totalGrowth >= 0
                ? "text-brand-600 dark:text-brand-400"
                : "text-danger-600 dark:text-danger-400"
            }`}
          >
            {assetStats.totalGrowth >= 0 ? "+" : ""}
            {formatCurrency(assetStats.totalGrowth)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            年平均成長率（CAGR）
          </p>
          <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {(assetStats.cagr * 100).toFixed(2)}%
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            想定利回り
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {(config.investmentReturnRate * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Asset Growth Chart */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          金融資産推移
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4EE4C0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4EE4C0" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="age"
              className="text-xs fill-slate-600 dark:fill-slate-400"
            />
            <YAxis
              className="text-xs fill-slate-600 dark:fill-slate-400"
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="投資資産"
              stackId="1"
              stroke="#4EE4C0"
              fill="url(#colorInvestment)"
            />
            <Area
              type="monotone"
              dataKey="現金"
              stackId="1"
              stroke="#94a3b8"
              fill="url(#colorCash)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Investment Performance */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          投資比率の推移
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="age"
              className="text-xs fill-slate-600 dark:fill-slate-400"
            />
            <YAxis
              className="text-xs fill-slate-600 dark:fill-slate-400"
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={(data) =>
                data.金融資産合計 > 0
                  ? ((data.投資資産 / data.金融資産合計) * 100).toFixed(1)
                  : 0
              }
              stroke="#4EE4C0"
              strokeWidth={3}
              dot={false}
              name="投資比率"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Table */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          年別詳細
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  年齢
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  現金
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  投資資産
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  金融資産合計
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  投資比率
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  年間投資額
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  前年比
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((data, index) => {
                const totalAssets = data.cash + data.investment;
                const investmentRatio =
                  totalAssets > 0 ? (data.investment / totalAssets) * 100 : 0;
                const prevData = index > 0 ? displayData[index - 1] : null;
                const growth = prevData
                  ? totalAssets - (prevData.cash + prevData.investment)
                  : 0;

                return (
                  <tr
                    key={data.age}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">
                      {data.age}歳
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatCurrency(data.cash)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-600 dark:text-brand-400 font-medium tabular-nums">
                      {formatCurrency(data.investment)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
                      {formatCurrency(totalAssets)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {investmentRatio.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatCurrency(data.investmentContribution)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium tabular-nums ${
                        growth >= 0
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-danger-600 dark:text-danger-400"
                      }`}
                    >
                      {index > 0 ? (
                        <>
                          {growth >= 0 ? "+" : ""}
                          {formatCurrency(growth)}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Investment Settings Info */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          投資設定
        </h3>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              投資戦略
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium">
              {config.investmentStrategy === "threshold"
                ? "閾値超過分のみ投資"
                : config.investmentStrategy === "all"
                ? "全額投資"
                : "カスタム比率"}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              期待リターン率
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              年{(config.investmentReturnRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              現金閾値
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.investmentThreshold)}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          投資設定を変更するには、設定ページから編集してください
        </p>
      </Card>
    </div>
  );
}
