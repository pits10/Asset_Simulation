"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { Card } from "@/components/shared";

export const CashflowBarChart: React.FC = () => {
  const { yearData, ageRangeStart, ageRangeEnd } = useSimulationStore();

  const chartData = useMemo(() => {
    return yearData
      .filter((d) => d.age >= ageRangeStart && d.age <= ageRangeEnd)
      .map((d) => ({
        age: d.age,
        cashFlow: d.cashFlow / 10000,
      }));
  }, [yearData, ageRangeStart, ageRangeEnd]);

  if (chartData.length === 0) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">データがありません</p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        年間キャッシュフロー
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />

          <XAxis
            dataKey="age"
            tick={{ fill: "rgb(100, 116, 139)" }}
            tickLine={{ stroke: "rgb(203, 213, 225)" }}
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
            formatter={(value: number) => [
              `¥${value.toFixed(1)}万`,
              value >= 0 ? "黒字" : "赤字",
            ]}
            labelFormatter={(label) => `年齢: ${label}`}
          />

          <ReferenceLine y={0} stroke="rgb(100, 116, 139)" strokeWidth={2} />

          <Bar dataKey="cashFlow" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.cashFlow >= 0 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
