"use client";

import React, { useState } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";
import { YearDataEditModal } from "@/components/shared";

export default function SimulationPage() {
  const { yearData, ageRangeStart, ageRangeEnd } = useSimulationStore();
  const [editingAge, setEditingAge] = useState<number | null>(null);

  const filteredData = yearData.filter(
    (data) => data.age >= ageRangeStart && data.age <= ageRangeEnd
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          年次シミュレーション
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          各年の詳細を確認・編集
        </p>
      </div>

      {/* Year Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                  年齢
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  収入（額面）
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  手取り
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  支出
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  収支
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                  資産
                </th>
                <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                  編集
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredData.map((data, index) => (
                <tr
                  key={data.age}
                  className={`
                    hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors
                    ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-800/50"}
                  `}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {data.age}歳
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {formatCurrency(data.grossIncome)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {formatCurrency(data.netIncome)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {formatCurrency(data.totalExpense)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-medium ${
                      data.cashFlow >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {data.cashFlow >= 0 ? "+" : ""}
                    {formatCurrency(data.cashFlow)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {formatCurrency(data.totalAssets)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setEditingAge(data.age)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
