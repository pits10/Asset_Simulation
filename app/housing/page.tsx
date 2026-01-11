"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatCurrency } from "@/lib/utils/format";
import type { HousePurchase } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function HousingPage() {
  const { yearData, ageRangeStart, ageRangeEnd, housePurchase, setHousePurchase, config } =
    useSimulationStore();
  const { addToast } = useUIStore();

  const [isEditing, setIsEditing] = useState(!housePurchase);

  // Form state
  const [age, setAge] = useState(housePurchase?.age || config.currentAge);
  const [propertyPrice, setPropertyPrice] = useState(
    housePurchase?.propertyPrice || 40_000_000
  );
  const [downPayment, setDownPayment] = useState(
    housePurchase?.downPayment || 8_000_000
  );
  const [loanTerm, setLoanTerm] = useState(housePurchase?.loanTerm || 35);
  const [interestRate, setInterestRate] = useState(
    housePurchase ? housePurchase.interestRate * 100 : 1.5
  );
  const [acquisitionCostRate, setAcquisitionCostRate] = useState(
    housePurchase ? housePurchase.acquisitionCostRate * 100 : 7
  );
  const [propertyTaxRate, setPropertyTaxRate] = useState(
    housePurchase ? housePurchase.propertyTaxRate * 100 : 1.4
  );
  const [annualMaintenanceCost, setAnnualMaintenanceCost] = useState(
    housePurchase?.annualMaintenanceCost || 200_000
  );
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState(
    housePurchase ? housePurchase.propertyAppreciationRate * 100 : -1
  );

  const loanAmount = propertyPrice - downPayment;
  const acquisitionCost = propertyPrice * (acquisitionCostRate / 100);
  const totalCost = propertyPrice + acquisitionCost;

  // Calculate monthly payment (元利均等)
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;
  const annualPayment = monthlyPayment * 12;

  const filteredData = yearData.filter(
    (data) => data.age >= ageRangeStart && data.age <= ageRangeEnd
  );

  // Prepare mortgage balance chart data
  const mortgageData = filteredData
    .filter((data) => data.mortgageBalance > 0)
    .map((data) => ({
      age: data.age,
      残債: data.mortgageBalance,
      不動産評価額: data.propertyValue,
    }));

  const handleSave = () => {
    const purchase: HousePurchase = {
      age,
      propertyPrice,
      downPayment,
      loanAmount,
      interestRate: interestRate / 100,
      loanTerm,
      acquisitionCostRate: acquisitionCostRate / 100,
      propertyTaxRate: propertyTaxRate / 100,
      annualMaintenanceCost,
      propertyAppreciationRate: propertyAppreciationRate / 100,
    };

    setHousePurchase(purchase);
    addToast("住宅購入情報を保存しました", "success");
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (confirm("住宅購入情報を削除してもよろしいですか？")) {
      setHousePurchase(null);
      addToast("住宅購入情報を削除しました", "info");
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            住宅・不動産
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            住宅ローンと不動産の分析
          </p>
        </div>
        {housePurchase && !isEditing && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              編集
            </Button>
            <Button variant="secondary" onClick={handleRemove}>
              削除
            </Button>
          </div>
        )}
      </div>

      {/* Housing Input Form */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          住宅購入シミュレーション
        </h2>

        {!isEditing && housePurchase ? (
          // Display mode
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">購入年齢</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {housePurchase.age}歳
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">物件価格</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(housePurchase.propertyPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">頭金</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(housePurchase.downPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">借入額</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(housePurchase.loanAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">金利</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {(housePurchase.interestRate * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">返済期間</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {housePurchase.loanTerm}年
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                年間返済額（概算）
              </p>
              <p className="text-lg font-medium text-red-600 dark:text-red-400">
                {formatCurrency(annualPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">固定資産税率</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {(housePurchase.propertyTaxRate * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                年間修繕費
              </p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(housePurchase.annualMaintenanceCost)}
              </p>
            </div>
          </div>
        ) : (
          // Edit mode
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  購入年齢
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  min={config.startAge}
                  max={config.endAge}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  物件価格
                </label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(parseFloat(e.target.value))}
                  step={1000000}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  頭金
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value))}
                  step={1000000}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  頭金比率: {((downPayment / propertyPrice) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  借入額（自動計算）
                </label>
                <div className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {formatCurrency(loanAmount)}
                </div>
              </div>
            </div>

            {/* Loan Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  金利（%）
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  step={0.1}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  返済期間（年）
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Cost Estimates */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                返済シミュレーション
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    月額返済額（概算）
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    年間返済額（概算）
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(annualPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">諸費用</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(acquisitionCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    総支払額（概算）
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  諸費用率（%）
                </label>
                <input
                  type="number"
                  value={acquisitionCostRate}
                  onChange={(e) =>
                    setAcquisitionCostRate(parseFloat(e.target.value))
                  }
                  step={0.1}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  登記費用、仲介手数料など
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  固定資産税率（%）
                </label>
                <input
                  type="number"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value))}
                  step={0.1}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  年間修繕費
                </label>
                <input
                  type="number"
                  value={annualMaintenanceCost}
                  onChange={(e) =>
                    setAnnualMaintenanceCost(parseFloat(e.target.value))
                  }
                  step={10000}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Property Value */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                不動産価格変動率（%/年）
              </label>
              <input
                type="number"
                value={propertyAppreciationRate}
                onChange={(e) =>
                  setPropertyAppreciationRate(parseFloat(e.target.value))
                }
                step={0.1}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                マイナスの場合は価値が減少します（例: -1% = 年1%減価）
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              {housePurchase && (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  キャンセル
                </Button>
              )}
              <Button variant="primary" onClick={handleSave} className="flex-1">
                保存
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Mortgage Chart */}
      {housePurchase && mortgageData.length > 0 && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            住宅ローン残債と不動産評価額の推移
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={mortgageData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
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
              <Area
                type="monotone"
                dataKey="残債"
                stroke="#ef4444"
                fill="url(#colorBalance)"
              />
              <Area
                type="monotone"
                dataKey="不動産評価額"
                stroke="#10b981"
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!housePurchase && (
        <Card padding="lg">
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              住宅購入情報が設定されていません
            </p>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              住宅購入を設定する
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
