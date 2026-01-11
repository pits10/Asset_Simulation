"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";

export default function PLBSTable() {
  const { yearData } = useSimulationStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center justify-between"
        >
          <span>詳細テーブル（PL / BS）を表示</span>
          <span>▼</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <button
        onClick={() => setIsExpanded(false)}
        className="w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center justify-between mb-4"
      >
        <span>詳細テーブル（PL / BS）</span>
        <span>▲</span>
      </button>

      <div className="space-y-8">
        {/* PL（損益計算書） */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">PL（損益計算書）</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold border-r border-gray-200 sticky left-0 bg-gray-100">
                    年齢
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">額面</th>
                  <th className="px-4 py-2 text-right font-semibold">所得税</th>
                  <th className="px-4 py-2 text-right font-semibold">住民税</th>
                  <th className="px-4 py-2 text-right font-semibold">社保</th>
                  <th className="px-4 py-2 text-right font-semibold bg-green-50">手取り</th>
                  <th className="px-4 py-2 text-right font-semibold">生活費</th>
                  <th className="px-4 py-2 text-right font-semibold">娯楽</th>
                  <th className="px-4 py-2 text-right font-semibold">投資積立</th>
                  <th className="px-4 py-2 text-right font-semibold">ローン</th>
                  <th className="px-4 py-2 text-right font-semibold bg-red-50">総支出</th>
                  <th className="px-4 py-2 text-right font-semibold bg-blue-50">収支</th>
                </tr>
              </thead>
              <tbody>
                {yearData.map((data, idx) => (
                  <tr key={data.age} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 font-medium border-r border-gray-200 sticky left-0 bg-inherit">
                      {data.age}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.grossIncome)}</td>
                    <td className="px-4 py-2 text-right text-red-600">
                      -{formatCurrency(data.incomeTax)}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600">
                      -{formatCurrency(data.residentTax)}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600">
                      -{formatCurrency(data.socialInsurance)}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-green-600 bg-green-50">
                      {formatCurrency(data.netIncome)}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.livingCost || 0)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.entertainmentCost)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.investmentContribution)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.mortgagePayment)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-red-600 bg-red-50">
                      {formatCurrency(data.totalExpense)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-bold bg-blue-50 ${
                        data.cashFlow >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(data.cashFlow)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BS（貸借対照表） */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">BS（貸借対照表）</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold border-r border-gray-200 sticky left-0 bg-gray-100">
                    年齢
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">現金</th>
                  <th className="px-4 py-2 text-right font-semibold">投資資産</th>
                  <th className="px-4 py-2 text-right font-semibold">不動産</th>
                  <th className="px-4 py-2 text-right font-semibold bg-blue-50">総資産</th>
                  <th className="px-4 py-2 text-right font-semibold">ローン残債</th>
                  <th className="px-4 py-2 text-right font-semibold bg-red-50">総負債</th>
                  <th className="px-4 py-2 text-right font-semibold bg-green-50">純資産</th>
                </tr>
              </thead>
              <tbody>
                {yearData.map((data, idx) => (
                  <tr key={data.age} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 font-medium border-r border-gray-200 sticky left-0 bg-inherit">
                      {data.age}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.cash)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.investment)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.propertyValue)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-blue-600 bg-blue-50">
                      {formatCurrency(data.totalAssets)}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(data.mortgageBalance)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-red-600 bg-red-50">
                      {formatCurrency(data.totalLiabilities)}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-green-600 bg-green-50">
                      {formatCurrency(data.netWorth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
