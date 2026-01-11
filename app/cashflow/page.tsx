"use client";

import React, { useState } from "react";
import { Card, YearDataEditModal } from "@/components/shared";
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
  Line,
  ComposedChart,
} from "recharts";

export default function CashflowPage() {
  const { yearData, ageRangeStart, ageRangeEnd } = useSimulationStore();
  const [editingAge, setEditingAge] = useState<number | null>(null);

  const filteredData = yearData.filter(
    (data) => data.age >= ageRangeStart && data.age <= ageRangeEnd
  );

  // Prepare chart data
  const chartData = filteredData.map((data) => ({
    age: data.age,
    収入: data.netIncome,
    支出: data.totalExpense,
    収支: data.cashFlow,
  }));

  // Calculate summary statistics
  const totalIncome = filteredData.reduce((sum, d) => sum + d.netIncome, 0);
  const totalExpense = filteredData.reduce((sum, d) => sum + d.totalExpense, 0);
  const totalCashflow = filteredData.reduce((sum, d) => sum + d.cashFlow, 0);
  const avgIncome = filteredData.length > 0 ? totalIncome / filteredData.length : 0;
  const avgExpense = filteredData.length > 0 ? totalExpense / filteredData.length : 0;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              期間合計収入（手取り）
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              平均: {formatCurrency(avgIncome)}/年
            </p>
          </div>
        </Card>

        <Card padding="md">
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              期間合計支出
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              平均: {formatCurrency(avgExpense)}/年
            </p>
          </div>
        </Card>

        <Card padding="md">
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              期間合計収支
            </p>
            <p
              className={`text-2xl font-bold ${
                totalCashflow >= 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {totalCashflow >= 0 ? "+" : ""}
              {formatCurrency(totalCashflow)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              平均: {formatCurrency(totalCashflow / (filteredData.length || 1))}/年
            </p>
          </div>
        </Card>
      </div>

      {/* Cashflow Chart */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          年次キャッシュフロー推移
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
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
            <Bar dataKey="収入" fill="#10b981" opacity={0.8} />
            <Bar dataKey="支出" fill="#ef4444" opacity={0.8} />
            <Line
              type="monotone"
              dataKey="収支"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Table */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            年次詳細
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                  年齢
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  額面収入
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  税金
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  手取り
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  生活費
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  その他支出
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  総支出
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  収支
                </th>
                <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredData.map((data, index) => {
                const totalTax =
                  data.incomeTax + data.residentTax + data.socialInsurance;
                const otherExpenses =
                  data.entertainmentCost +
                  data.otherExpenses +
                  data.mortgagePayment +
                  data.propertyTax +
                  data.maintenanceCost;

                return (
                  <tr
                    key={data.age}
                    className={`
                      hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer
                      ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-800/50"}
                    `}
                    onClick={() => setEditingAge(data.age)}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {data.age}歳
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(data.grossIncome)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(totalTax)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(data.netIncome)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(data.livingCost || 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(otherExpenses)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-red-600 dark:text-red-400 font-medium">
                      {formatCurrency(data.totalExpense)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-bold ${
                        data.cashFlow >= 0
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {data.cashFlow >= 0 ? "+" : ""}
                      {formatCurrency(data.cashFlow)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAge(data.age);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="編集"
                      >
                        <svg
                          className="w-4 h-4 text-slate-600 dark:text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          データがありません。設定ページで初期値を設定してください。
        </div>
      )}

      {/* Edit Modal */}
      {editingAge !== null && (
        <YearDataEditModal
          isOpen={editingAge !== null}
          onClose={() => setEditingAge(null)}
          age={editingAge}
        />
      )}
    </div>
  );
}
