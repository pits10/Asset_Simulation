"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { Card } from "@/components/shared";
import { formatCurrency } from "@/lib/utils/format";

const COLORS = {
  cash: "rgb(6, 182, 212)", // Cyan
  investment: "rgb(20, 184, 166)", // Teal
  property: "rgb(249, 115, 22)", // Orange
};

export const AssetCompositionChart: React.FC = () => {
  const { yearData, ageRangeEnd } = useSimulationStore();

  const chartData = useMemo(() => {
    if (yearData.length === 0) return [];

    const latestData = yearData.find((d) => d.age === ageRangeEnd) || yearData[yearData.length - 1];

    const data = [];

    if (latestData.cash > 0) {
      data.push({
        name: "Cash",
        value: latestData.cash / 10000,
        percentage: 0,
      });
    }

    if (latestData.investment > 0) {
      data.push({
        name: "Investment",
        value: latestData.investment / 10000,
        percentage: 0,
      });
    }

    if (latestData.propertyValue && latestData.propertyValue > 0) {
      data.push({
        name: "Property",
        value: latestData.propertyValue / 10000,
        percentage: 0,
      });
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    data.forEach((item) => {
      item.percentage = (item.value / total) * 100;
    });

    return data;
  }, [yearData, ageRangeEnd]);

  const totalAssets = useMemo(() => {
    if (yearData.length === 0) return "¥0万";
    const latestData = yearData.find((d) => d.age === ageRangeEnd) || yearData[yearData.length - 1];
    return formatCurrency(latestData.totalAssets);
  }, [yearData, ageRangeEnd]);

  if (chartData.length === 0) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Asset Composition
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
            labelLine={{ stroke: "rgb(100, 116, 139)", strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name === "Cash"
                    ? COLORS.cash
                    : entry.name === "Investment"
                    ? COLORS.investment
                    : COLORS.property
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid rgb(226, 232, 240)",
              borderRadius: "8px",
              padding: "12px",
            }}
            formatter={(value: number, name: string) => [
              `¥${value.toFixed(1)}万 (${
                ((value / chartData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)
              }%)`,
              name,
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>
            )}
          />

          {/* Center Label */}
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-slate-500 dark:fill-slate-400"
          >
            Total Assets
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-semibold fill-slate-900 dark:fill-slate-50 tabular-nums"
          >
            {totalAssets}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
