"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function HousingPage() {
  const { yearData, ageRangeStart, ageRangeEnd, housePurchase } =
    useSimulationStore();

  const displayData = useMemo(() => {
    return yearData.filter(
      (d) => d.age >= ageRangeStart && d.age <= ageRangeEnd
    );
  }, [yearData, ageRangeStart, ageRangeEnd]);

  const housingData = useMemo(() => {
    if (!housePurchase) return null;

    const purchaseData = displayData.filter(
      (d) => d.age >= housePurchase.age
    );

    if (purchaseData.length === 0) return null;

    const chartData = purchaseData.map((d) => ({
      age: `${d.age}歳`,
      資産価値: d.propertyValue,
      ローン残債: d.mortgageBalance,
      純資産価値: d.propertyValue - d.mortgageBalance,
    }));

    const paymentData = purchaseData.map((d) => ({
      age: `${d.age}歳`,
      元金: d.mortgagePrincipal,
      利息: d.mortgageInterest,
      合計: d.mortgagePayment,
    }));

    const totalPaid = purchaseData.reduce(
      (sum, d) => sum + d.mortgagePayment,
      0
    );
    const totalInterest = purchaseData.reduce(
      (sum, d) => sum + d.mortgageInterest,
      0
    );
    const totalPrincipal = purchaseData.reduce(
      (sum, d) => sum + d.mortgagePrincipal,
      0
    );

    return {
      chartData,
      paymentData,
      purchaseData,
      totalPaid,
      totalInterest,
      totalPrincipal,
    };
  }, [displayData, housePurchase]);

  if (!housePurchase) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            住宅・不動産
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            住宅ローンと不動産の分析
          </p>
        </div>

        <Card padding="lg">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
              住宅購入が設定されていません
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              設定ページから住宅購入の設定を追加してください
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!housingData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            住宅・不動産
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            住宅ローンと不動産の分析
          </p>
        </div>
        <Card padding="lg">
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              表示範囲内に住宅購入データがありません
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          住宅・不動産
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          住宅ローンと不動産の分析
        </p>
      </div>

      {/* Purchase Summary */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          購入情報
        </h3>
        <div className="grid grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              購入年齢
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold">
              {housePurchase.age}歳
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              物件価格
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
              {formatCurrency(housePurchase.propertyPrice)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">頭金</p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
              {formatCurrency(housePurchase.downPayment)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              借入額
            </p>
            <p className="text-brand-600 dark:text-brand-400 font-semibold tabular-nums">
              {formatCurrency(housePurchase.loanAmount)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">金利</p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
              {(housePurchase.interestRate * 100).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              ローン期間
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold">
              {housePurchase.loanTerm}年
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              返済完了年齢
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold">
              {housePurchase.age + housePurchase.loanTerm}歳
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              年間修繕費
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
              {formatCurrency(housePurchase.annualMaintenanceCost)}
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            総支払額
          </p>
          <p className="text-2xl font-semibold text-danger-600 dark:text-danger-400 tabular-nums">
            {formatCurrency(housingData.totalPaid)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            元金
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {formatCurrency(housingData.totalPrincipal)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            利息
          </p>
          <p className="text-2xl font-semibold text-warning-600 dark:text-warning-400 tabular-nums">
            {formatCurrency(housingData.totalInterest)}
          </p>
        </Card>
      </div>

      {/* Property Value Chart */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          資産価値とローン残債の推移
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={housingData.chartData}>
            <defs>
              <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4EE4C0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4EE4C0" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
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
              dataKey="資産価値"
              stroke="#4EE4C0"
              fill="url(#colorProperty)"
            />
            <Area
              type="monotone"
              dataKey="ローン残債"
              stroke="#ef4444"
              fill="url(#colorDebt)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Breakdown Chart */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          年間返済額の内訳
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={housingData.paymentData}>
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
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
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
              dataKey="元金"
              stackId="1"
              stroke="#4EE4C0"
              fill="#4EE4C0"
            />
            <Area
              type="monotone"
              dataKey="利息"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Table */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          年別返済スケジュール
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  年齢
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  年間返済額
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  元金
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  利息
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  残債
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  資産価値
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                  純資産
                </th>
              </tr>
            </thead>
            <tbody>
              {housingData.purchaseData.map((data) => {
                const netValue = data.propertyValue - data.mortgageBalance;
                return (
                  <tr
                    key={data.age}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">
                      {data.age}歳
                    </td>
                    <td className="py-3 px-4 text-right text-danger-600 dark:text-danger-400 font-medium tabular-nums">
                      {formatCurrency(data.mortgagePayment)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatCurrency(data.mortgagePrincipal)}
                    </td>
                    <td className="py-3 px-4 text-right text-warning-600 dark:text-warning-400 tabular-nums">
                      {formatCurrency(data.mortgageInterest)}
                    </td>
                    <td className="py-3 px-4 text-right text-danger-600 dark:text-danger-400 font-semibold tabular-nums">
                      {formatCurrency(data.mortgageBalance)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-600 dark:text-brand-400 font-medium tabular-nums">
                      {formatCurrency(data.propertyValue)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-50 font-semibold tabular-nums">
                      {formatCurrency(netValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
