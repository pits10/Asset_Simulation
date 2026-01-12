"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CashflowPage() {
  const { yearData, ageRangeStart, ageRangeEnd } = useSimulationStore();

  const displayData = useMemo(() => {
    return yearData.filter(
      (d) => d.age >= ageRangeStart && d.age <= ageRangeEnd
    );
  }, [yearData, ageRangeStart, ageRangeEnd]);

  const chartData = useMemo(() => {
    return displayData.map((d) => ({
      age: `${d.age}歳`,
      収入: d.netIncome,
      支出: -d.totalExpense,
      収支: d.cashFlow,
    }));
  }, [displayData]);

  const totalStats = useMemo(() => {
    if (displayData.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalCashFlow: 0,
        avgIncome: 0,
        avgExpense: 0,
      };
    }

    const totalIncome = displayData.reduce((sum, d) => sum + d.netIncome, 0);
    const totalExpense = displayData.reduce((sum, d) => sum + d.totalExpense, 0);
    const totalCashFlow = displayData.reduce((sum, d) => sum + d.cashFlow, 0);

    return {
      totalIncome,
      totalExpense,
      totalCashFlow,
      avgIncome: totalIncome / displayData.length,
      avgExpense: totalExpense / displayData.length,
    };
  }, [displayData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          キャッシュフロー
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          収入・支出とキャッシュフローの分析
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            累計収入
          </p>
          <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {formatCurrency(totalStats.totalIncome)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            累計支出
          </p>
          <p className="text-2xl font-semibold text-danger-600 dark:text-danger-400 tabular-nums">
            {formatCurrency(totalStats.totalExpense)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            累計収支
          </p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              totalStats.totalCashFlow >= 0
                ? "text-brand-600 dark:text-brand-400"
                : "text-danger-600 dark:text-danger-400"
            }`}
          >
            {formatCurrency(totalStats.totalCashFlow)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            平均年収
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {formatCurrency(totalStats.avgIncome)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            平均年間支出
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {formatCurrency(totalStats.avgExpense)}
          </p>
        </Card>
      </div>

      {/* Cashflow Chart */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          年間キャッシュフロー推移
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
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
              tickFormatter={(value) =>
                `${value >= 0 ? "" : "-"}${Math.abs(value / 1000000).toFixed(0)}M`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              formatter={(value: number) => formatCurrency(Math.abs(value))}
            />
            <Legend />
            <Bar
              dataKey="収入"
              fill="#4EE4C0"
              radius={[4, 4, 0, 0]}
              name="手取り収入"
            />
            <Bar
              dataKey="支出"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="総支出"
            />
          </BarChart>
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
                  額面年収
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  手取り
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  生活費
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  投資
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  住宅費
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  総支出
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  収支
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((data) => (
                <tr
                  key={data.age}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">
                    {data.age}歳
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatCurrency(data.grossIncome)}
                  </td>
                  <td className="py-3 px-4 text-right text-brand-600 dark:text-brand-400 font-medium tabular-nums">
                    {formatCurrency(data.netIncome)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatCurrency(data.livingCost || 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatCurrency(data.investmentContribution)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatCurrency(
                      data.mortgagePayment + data.propertyTax + data.maintenanceCost
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-danger-600 dark:text-danger-400 font-medium tabular-nums">
                    {formatCurrency(data.totalExpense)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold tabular-nums ${
                      data.cashFlow >= 0
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-danger-600 dark:text-danger-400"
                    }`}
                  >
                    {data.cashFlow >= 0 ? "+" : ""}
                    {formatCurrency(data.cashFlow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
