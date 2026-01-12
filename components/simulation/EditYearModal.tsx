"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import type { YearData } from "@/lib/types";

interface EditYearModalProps {
  age: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditYearModal: React.FC<EditYearModalProps> = ({
  age,
  isOpen,
  onClose,
}) => {
  const { yearData, updateYearData } = useSimulationStore();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    salary: 0,
    livingCost: 0,
    entertainmentCost: 0,
    otherExpenses: 0,
    investmentContribution: 0,
    otherExpensesMemo: "",
  });

  useEffect(() => {
    if (isOpen && age !== null) {
      const data = yearData.find((d) => d.age === age);
      if (data) {
        setFormData({
          salary: data.salary || 0,
          livingCost: data.livingCost || 0,
          entertainmentCost: data.entertainmentCost || 0,
          otherExpenses: data.otherExpenses || 0,
          investmentContribution: data.investmentContribution || 0,
          otherExpensesMemo: data.otherExpensesMemo || "",
        });
      }
    }
  }, [isOpen, age, yearData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (age === null) return;

    try {
      updateYearData(age, formData);
      addToast("年次データを更新しました", "success");
      onClose();
    } catch (error) {
      addToast("更新に失敗しました", "error");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (age === null) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${age}歳の編集`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 年収 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            年収（額面）
          </label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => handleChange("salary", parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            step={100000}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            デフォルト値から変更する場合のみ入力してください
          </p>
        </div>

        {/* 生活費 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            生活費
          </label>
          <input
            type="number"
            value={formData.livingCost}
            onChange={(e) =>
              handleChange("livingCost", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            step={50000}
          />
        </div>

        {/* 娯楽費 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            娯楽・旅行費
          </label>
          <input
            type="number"
            value={formData.entertainmentCost}
            onChange={(e) =>
              handleChange("entertainmentCost", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            step={10000}
          />
        </div>

        {/* その他支出 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            その他支出
          </label>
          <input
            type="number"
            value={formData.otherExpenses}
            onChange={(e) =>
              handleChange("otherExpenses", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            step={10000}
          />
        </div>

        {/* その他支出メモ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            メモ
          </label>
          <input
            type="text"
            value={formData.otherExpensesMemo}
            onChange={(e) => handleChange("otherExpensesMemo", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="例: 車購入、引越しなど"
          />
        </div>

        {/* 年間投資額 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            年間投資額
          </label>
          <input
            type="number"
            value={formData.investmentContribution}
            onChange={(e) =>
              handleChange(
                "investmentContribution",
                parseInt(e.target.value) || 0
              )
            }
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            step={50000}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            つみたてNISAなどの定期積立額
          </p>
        </div>

        {/* 警告 */}
        <div className="bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
          <p className="text-sm text-warning-700 dark:text-warning-400">
            ⚠️ 編集した値は、該当年のみに反映されます。以降の年も変更するには、設定ページから基本値を変更してください。
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose} type="button">
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </Modal>
  );
};
