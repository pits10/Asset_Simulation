"use client";

import React, { useState } from "react";
import { Modal, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";

export const OnboardingModal: React.FC = () => {
  const { activeModal, closeModal, addToast } = useUIStore();
  const { initializeFromOnboarding } = useSimulationStore();

  const [formData, setFormData] = useState({
    name: "",
    currentAge: 30,
    annualSalary: 5000000,
    currentAssets: 3000000,
    annualInvestment: 600000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isOpen = activeModal === "onboarding";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "名前を入力してください";
    }

    if (formData.currentAge < 18 || formData.currentAge > 100) {
      newErrors.currentAge = "年齢は18〜100歳の範囲で入力してください";
    }

    if (formData.annualSalary <= 0) {
      newErrors.annualSalary = "年収は正の値を入力してください";
    }

    if (formData.currentAssets < 0) {
      newErrors.currentAssets = "資産はマイナスにできません";
    }

    if (formData.annualInvestment < 0) {
      newErrors.annualInvestment = "投資額はマイナスにできません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      initializeFromOnboarding(formData);
      addToast("初期設定が完了しました！", "success");
      closeModal();
    } catch (error) {
      addToast("初期設定に失敗しました", "error");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing on backdrop click for onboarding
      title=""
      size="md"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-brand-500 dark:text-brand-400">FIRE</span>
          <span className="text-slate-700 dark:text-slate-300">?</span>
          <span className="ml-2">へようこそ</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          あなたは何歳でFIREできる？まずは基本情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 名前 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            お名前 <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
              errors.name
                ? "border-danger-500"
                : "border-slate-300 dark:border-slate-600"
            }`}
            placeholder="山田 太郎"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger-500">{errors.name}</p>
          )}
        </div>

        {/* 現在の年齢 */}
        <div>
          <label
            htmlFor="currentAge"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            現在の年齢 <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="currentAge"
              value={formData.currentAge}
              onChange={(e) => handleChange("currentAge", parseInt(e.target.value))}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.currentAge
                  ? "border-danger-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
              min={18}
              max={100}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              歳
            </span>
          </div>
          {errors.currentAge && (
            <p className="mt-1 text-sm text-danger-500">{errors.currentAge}</p>
          )}
        </div>

        {/* 年収 */}
        <div>
          <label
            htmlFor="annualSalary"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            現在の年収（額面） <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="annualSalary"
              value={formData.annualSalary}
              onChange={(e) =>
                handleChange("annualSalary", parseInt(e.target.value))
              }
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.annualSalary
                  ? "border-danger-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
              step={100000}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              円/年
            </span>
          </div>
          {errors.annualSalary && (
            <p className="mt-1 text-sm text-danger-500">{errors.annualSalary}</p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            例: 5,000,000円 = 500万円
          </p>
        </div>

        {/* 現在の金融資産 */}
        <div>
          <label
            htmlFor="currentAssets"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            現在の金融資産（現金+投資） <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="currentAssets"
              value={formData.currentAssets}
              onChange={(e) =>
                handleChange("currentAssets", parseInt(e.target.value))
              }
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.currentAssets
                  ? "border-danger-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
              step={100000}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              円
            </span>
          </div>
          {errors.currentAssets && (
            <p className="mt-1 text-sm text-danger-500">{errors.currentAssets}</p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            預金・株式・投資信託などの合計額
          </p>
        </div>

        {/* 年間投資額 */}
        <div>
          <label
            htmlFor="annualInvestment"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            年間投資額 <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="annualInvestment"
              value={formData.annualInvestment}
              onChange={(e) =>
                handleChange("annualInvestment", parseInt(e.target.value))
              }
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.annualInvestment
                  ? "border-danger-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
              step={50000}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              円/年
            </span>
          </div>
          {errors.annualInvestment && (
            <p className="mt-1 text-sm text-danger-500">
              {errors.annualInvestment}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            つみたてNISAなど毎年積み立てる金額
          </p>
        </div>

        {/* 自動設定の説明 */}
        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-2">
            自動設定される値
          </h4>
          <ul className="text-xs text-brand-600 dark:text-brand-300 space-y-1">
            <li>• 年収成長率: 年2%</li>
            <li>• 投資利回り: 年5%</li>
            <li>• 生活費: 年収の60%</li>
            <li>• シミュレーション範囲: {formData.currentAge}歳〜65歳</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full py-3 text-base font-semibold">
            シミュレーションを開始
          </Button>
        </div>
      </form>
    </Modal>
  );
};
