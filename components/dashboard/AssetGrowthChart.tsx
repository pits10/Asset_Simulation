"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { Card } from "@/components/shared";
import { formatCurrency } from "@/lib/utils/format";

export const AssetGrowthChart: React.FC = () => {
  const { yearData, ageRangeStart, ageRangeEnd } = useSimulationStore();

  const chartData = useMemo(() => {
    return yearData
      .filter((d) => d.age >= ageRangeStart && d.age <= ageRangeEnd)
      .map((d) => ({
        age: d.age,
        totalAssets: d.totalAssets / 10000,
        financialAssets: (d.cash + d.investment) / 10000,
        investmentAssets: d.investment / 10000,
        liabilities: d.totalLiabilities / 10000,
        netWorth: d.netWorth / 10000,
      }));
  }, [yearData, ageRangeStart, ageRangeEnd]);

  if (chartData.length === 0) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Asset Growth Over Time
      </h3>

      <ResponsiveContainer width="100%" height={450}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFinancial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(20, 184, 166)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="rgb(20, 184, 166)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />

          <XAxis
            dataKey="age"
            tick={{ fill: "rgb(100, 116, 139)" }}
            tickLine={{ stroke: "rgb(203, 213, 225)" }}
            label={{ value: "Age", position: "insideBottom", offset: -5, fill: "rgb(100, 116, 139)" }}
          />

          <YAxis
            tick={{ fill: "rgb(100, 116, 139)" }}
            tickLine={{ stroke: "rgb(203, 213, 225)" }}
            label={{
              value: "Amount (万円)",
              angle: -90,
              position: "insideLeft",
              fill: "rgb(100, 116, 139)",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid rgb(226, 232, 240)",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ fontWeight: 600, marginBottom: "8px" }}
            formatter={(value: number) => `¥${value.toFixed(1)}万`}
            labelFormatter={(label) => `Age: ${label}`}
          />

          <Legend
            verticalAlign="top"
            height={36}
            iconType="line"
            wrapperStyle={{ paddingBottom: "10px" }}
          />

          <Area
            type="monotone"
            dataKey="investmentAssets"
            stroke="rgb(20, 184, 166)"
            strokeWidth={2}
            fill="url(#colorInvestment)"
            name="Investment Assets"
          />

          <Area
            type="monotone"
            dataKey="financialAssets"
            stroke="rgb(16, 185, 129)"
            strokeWidth={2}
            fill="url(#colorFinancial)"
            name="Financial Assets"
          />

          <Line
            type="monotone"
            dataKey="totalAssets"
            stroke="rgb(59, 130, 246)"
            strokeWidth={3}
            dot={false}
            name="Total Assets"
          />

          <Line
            type="monotone"
            dataKey="liabilities"
            stroke="rgb(239, 68, 68)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Liabilities"
          />

          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="rgb(139, 92, 246)"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
            name="Net Worth"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
