"use client";

import React, { useState, useEffect } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { formatCurrency } from "@/lib/utils/format";

interface YearDataEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  age: number;
}

export function YearDataEditModal({ isOpen, onClose, age }: YearDataEditModalProps) {
  const { yearData, updateYearData, config } = useSimulationStore();
  const { addToast } = useUIStore();

  // Find the current year's data
  const currentYearData = yearData.find((d) => d.age === age);

  // Form state
  const [salary, setSalary] = useState<string>("");
  const [livingCost, setLivingCost] = useState<string>("");
  const [entertainmentCost, setEntertainmentCost] = useState<string>("");
  const [otherExpenses, setOtherExpenses] = useState<string>("");
  const [otherExpensesMemo, setOtherExpensesMemo] = useState<string>("");
  const [investmentContribution, setInvestmentContribution] = useState<string>("");

  // Initialize form with current data
  useEffect(() => {
    if (currentYearData) {
      setSalary(currentYearData.salary?.toString() || "");
      setLivingCost(currentYearData.livingCost?.toString() || "");
      setEntertainmentCost(currentYearData.entertainmentCost.toString());
      setOtherExpenses(currentYearData.otherExpenses.toString());
      setOtherExpensesMemo(currentYearData.otherExpensesMemo || "");
      setInvestmentContribution(currentYearData.investmentContribution.toString());
    }
  }, [currentYearData, age]);

  const handleSave = () => {
    // Parse values - allow null for salary and livingCost (will use calculated defaults)
    const updates: any = {
      entertainmentCost: parseFloat(entertainmentCost) || 0,
      otherExpenses: parseFloat(otherExpenses) || 0,
      otherExpensesMemo,
      investmentContribution: parseFloat(investmentContribution) || 0,
    };

    // Only set salary if user provided a value, otherwise leave as null (use calculated)
    if (salary && salary.trim() !== "") {
      updates.salary = parseFloat(salary) || null;
    }

    // Only set livingCost if user provided a value
    if (livingCost && livingCost.trim() !== "") {
      updates.livingCost = parseFloat(livingCost) || null;
    }

    updateYearData(age, updates);
    addToast("年次データを更新しました", "success");
    onClose();
  };

  const handleReset = () => {
    // Reset to calculated defaults by setting to null
    updateYearData(age, {
      salary: null,
      livingCost: null,
      entertainmentCost: 0,
      otherExpenses: 0,
      otherExpensesMemo: "",
      investmentContribution: 0,
    });
    addToast("デフォルト値にリセットしました", "info");
    onClose();
  };

  if (!currentYearData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${age}歳のデータ編集`}>
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">現在の手取り</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(currentYearData.netIncome)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">現在の総支出</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(currentYearData.totalExpense)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700 dark:text-slate-300">年次収支</span>
            <span className={currentYearData.cashFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {currentYearData.cashFlow >= 0 ? "+" : ""}
              {formatCurrency(currentYearData.cashFlow)}
            </span>
          </div>
        </div>

        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">収入</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              年収（額面）
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={`計算値: ${formatCurrency(currentYearData.grossIncome)}`}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              空欄の場合は自動計算されます（基本給 × 成長率 + ライフイベント影響）
            </p>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">支出</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              生活費（年額）
            </label>
            <input
              type="number"
              value={livingCost}
              onChange={(e) => setLivingCost(e.target.value)}
              placeholder={`計算値: ${formatCurrency(config.baseLivingCost * Math.pow(1 + config.livingCostInflationRate, age - config.currentAge))}`}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              空欄の場合は自動計算されます（基本生活費 × インフレ率 × ライフイベント影響）
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              娯楽・旅行費（年額）
            </label>
            <input
              type="number"
              value={entertainmentCost}
              onChange={(e) => setEntertainmentCost(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              その他支出（年額）
            </label>
            <input
              type="number"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              その他支出のメモ
            </label>
            <textarea
              value={otherExpensesMemo}
              onChange={(e) => setOtherExpensesMemo(e.target.value)}
              placeholder="例：車検、医療費、冠婚葬祭など"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">投資</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              積立投資額（年額）
            </label>
            <input
              type="number"
              value={investmentContribution}
              onChange={(e) => setInvestmentContribution(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              この年に追加で投資する金額を入力してください
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            キャンセル
          </Button>
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            リセット
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
}
