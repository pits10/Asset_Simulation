"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import type { SimulationConfig, HousePurchase } from "@/lib/types";

type EditType = "personal-info" | "income" | "expense" | "investment" | "housing";

interface EditConfigModalProps {
  type: EditType;
  isOpen: boolean;
  onClose: () => void;
}

export const EditConfigModal: React.FC<EditConfigModalProps> = ({
  type,
  isOpen,
  onClose,
}) => {
  const { config, housePurchase, updateConfig, setHousePurchase } =
    useSimulationStore();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState<Partial<SimulationConfig>>({});
  const [housingData, setHousingData] = useState<Partial<HousePurchase> | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setFormData(config);
      setHousingData(housePurchase);
    }
  }, [isOpen, config, housePurchase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "housing") {
        if (housingData && housingData.age && housingData.propertyPrice) {
          const loanAmount =
            (housingData.propertyPrice || 0) - (housingData.downPayment || 0);
          setHousePurchase({
            age: housingData.age,
            propertyPrice: housingData.propertyPrice,
            downPayment: housingData.downPayment || 0,
            loanAmount,
            interestRate: housingData.interestRate || 0.01,
            loanTerm: housingData.loanTerm || 35,
            acquisitionCostRate: 0.07,
            propertyTaxRate: 0.014,
            annualMaintenanceCost: housingData.annualMaintenanceCost || 100000,
            propertyAppreciationRate: 0.005,
          });
        } else {
          setHousePurchase(null);
        }
      } else {
        updateConfig(formData);
      }

      addToast("設定を更新しました", "success");
      onClose();
    } catch (error) {
      addToast("設定の更新に失敗しました", "error");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    if (type === "housing") {
      setHousingData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getTitle = () => {
    switch (type) {
      case "personal-info":
        return "個人情報の編集";
      case "income":
        return "収入設定の編集";
      case "expense":
        return "支出設定の編集";
      case "investment":
        return "投資戦略の編集";
      case "housing":
        return "住宅設定の編集";
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case "personal-info":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                名前
              </label>
              <input
                type="text"
                value={formData.userName || ""}
                onChange={(e) => handleChange("userName", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                開始年齢
              </label>
              <input
                type="number"
                value={formData.startAge || 18}
                onChange={(e) =>
                  handleChange("startAge", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={18}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                終了年齢
              </label>
              <input
                type="number"
                value={formData.endAge || 65}
                onChange={(e) =>
                  handleChange("endAge", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={18}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                現在年齢
              </label>
              <input
                type="number"
                value={formData.currentAge || 30}
                onChange={(e) =>
                  handleChange("currentAge", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={18}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                初期現金（円）
              </label>
              <input
                type="number"
                value={formData.initialCash || 0}
                onChange={(e) =>
                  handleChange("initialCash", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={100000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                初期投資資産（円）
              </label>
              <input
                type="number"
                value={formData.initialInvestment || 0}
                onChange={(e) =>
                  handleChange("initialInvestment", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={100000}
              />
            </div>
          </>
        );

      case "income":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                基本年収（円）
              </label>
              <input
                type="number"
                value={formData.baseSalary || 0}
                onChange={(e) =>
                  handleChange("baseSalary", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={100000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                年間成長率（%）
              </label>
              <input
                type="number"
                value={(formData.salaryGrowthRate || 0) * 100}
                onChange={(e) =>
                  handleChange(
                    "salaryGrowthRate",
                    parseFloat(e.target.value) / 100
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={0.1}
              />
            </div>
          </>
        );

      case "expense":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                基本生活費（円/年）
              </label>
              <input
                type="number"
                value={formData.baseLivingCost || 0}
                onChange={(e) =>
                  handleChange("baseLivingCost", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={100000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                物価上昇率（%）
              </label>
              <input
                type="number"
                value={(formData.livingCostInflationRate || 0) * 100}
                onChange={(e) =>
                  handleChange(
                    "livingCostInflationRate",
                    parseFloat(e.target.value) / 100
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={0.1}
              />
            </div>
          </>
        );

      case "investment":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                期待リターン率（%）
              </label>
              <input
                type="number"
                value={(formData.investmentReturnRate || 0) * 100}
                onChange={(e) =>
                  handleChange(
                    "investmentReturnRate",
                    parseFloat(e.target.value) / 100
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                現金閾値（円）
              </label>
              <input
                type="number"
                value={formData.investmentThreshold || 0}
                onChange={(e) =>
                  handleChange("investmentThreshold", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={100000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                投資戦略
              </label>
              <select
                value={formData.investmentStrategy || "threshold"}
                onChange={(e) => handleChange("investmentStrategy", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="threshold">閾値超過分のみ投資</option>
                <option value="all">全額投資</option>
                <option value="custom">カスタム比率</option>
              </select>
            </div>
            {formData.investmentStrategy === "custom" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  投資比率（%）
                </label>
                <input
                  type="number"
                  value={(formData.investmentRatio || 0) * 100}
                  onChange={(e) =>
                    handleChange(
                      "investmentRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  step={1}
                  min={0}
                  max={100}
                />
              </div>
            )}
          </>
        );

      case "housing":
        return (
          <>
            <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-brand-700 dark:text-brand-400">
                住宅購入を削除する場合は、すべてのフィールドを空にしてください
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                購入年齢
              </label>
              <input
                type="number"
                value={housingData?.age || ""}
                onChange={(e) =>
                  handleChange("age", e.target.value ? parseInt(e.target.value) : "")
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={18}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                物件価格（円）
              </label>
              <input
                type="number"
                value={housingData?.propertyPrice || ""}
                onChange={(e) =>
                  handleChange(
                    "propertyPrice",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={1000000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                頭金（円）
              </label>
              <input
                type="number"
                value={housingData?.downPayment || ""}
                onChange={(e) =>
                  handleChange(
                    "downPayment",
                    e.target.value ? parseInt(e.target.value) : 0
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={1000000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                金利（%）
              </label>
              <input
                type="number"
                value={(housingData?.interestRate || 0.01) * 100}
                onChange={(e) =>
                  handleChange("interestRate", parseFloat(e.target.value) / 100)
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                ローン期間（年）
              </label>
              <input
                type="number"
                value={housingData?.loanTerm || 35}
                onChange={(e) =>
                  handleChange("loanTerm", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={1}
                max={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                年間修繕費（円）
              </label>
              <input
                type="number"
                value={housingData?.annualMaintenanceCost || 100000}
                onChange={(e) =>
                  handleChange(
                    "annualMaintenanceCost",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                step={10000}
              />
            </div>
          </>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormFields()}

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
