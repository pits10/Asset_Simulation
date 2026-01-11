"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

type ChartTab = "assets" | "financial" | "liabilities" | "cashflow";

export default function MainCharts() {
  const { yearData } = useSimulationStore();
  const [activeTab, setActiveTab] = useState<ChartTab>("assets");

  const tabs: { id: ChartTab; label: string }[] = [
    { id: "assets", label: "総資産/純資産" },
    { id: "financial", label: "金融資産内訳" },
    { id: "liabilities", label: "負債" },
    { id: "cashflow", label: "年次収支" },
  ];

  const chartData = yearData.map((d) => ({
    age: d.age,
    totalAssets: d.totalAssets / 10000,
    netWorth: d.netWorth / 10000,
    cash: d.cash / 10000,
    investment: d.investment / 10000,
    liabilities: d.totalLiabilities / 10000,
    cashFlow: d.cashFlow / 10000,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[400px]">
        {activeTab === "assets" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{ value: "年齢", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "万円", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(0)}万円`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalAssets"
                stroke="#3b82f6"
                strokeWidth={2}
                name="総資産"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#10b981"
                strokeWidth={2}
                name="純資産"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === "financial" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{ value: "年齢", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "万円", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(0)}万円`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cash"
                stackId="1"
                stroke="#6b7280"
                fill="#9ca3af"
                name="現金"
              />
              <Area
                type="monotone"
                dataKey="investment"
                stackId="1"
                stroke="#6366f1"
                fill="#818cf8"
                name="投資資産"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === "liabilities" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{ value: "年齢", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "万円", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(0)}万円`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="liabilities"
                stroke="#ef4444"
                strokeWidth={2}
                name="負債（ローン残債）"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === "cashflow" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{ value: "年齢", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "万円", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(0)}万円`}
              />
              <Legend />
              <Bar
                dataKey="cashFlow"
                fill="#10b981"
                name="年次収支"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
