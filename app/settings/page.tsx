"use client";

import React from "react";
import { Card, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatCurrency } from "@/lib/utils/format";

export default function SettingsPage() {
  const { config, housePurchase, resetToDefaults } = useSimulationStore();
  const { addToast } = useUIStore();

  const handleReset = () => {
    if (confirm("全ての設定をデフォルトに戻しますか？")) {
      resetToDefaults();
      addToast("設定をデフォルトに戻しました", "success");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          設定
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          資産シミュレーションの設定
        </p>
      </div>

      {/* Personal Information */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            個人情報
          </h3>
          <Button variant="ghost" size="sm">
            編集
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">開始年齢</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.startAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">終了年齢</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.endAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">現在年齢</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.currentAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">初期資金</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.initialCash)}
            </p>
          </div>
        </div>
      </Card>

      {/* Income Settings */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            収入設定
          </h3>
          <Button variant="ghost" size="sm">
            編集
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">基本年収</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.baseSalary)}/年
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              年間成長率
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.salaryGrowthRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Expense Settings */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            支出設定
          </h3>
          <Button variant="ghost" size="sm">
            編集
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              基本生活費
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.baseLivingCost)}/年
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              物価上昇率
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.livingCostInflationRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Investment Strategy */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            投資戦略
          </h3>
          <Button variant="ghost" size="sm">
            編集
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              期待リターン率
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.investmentReturnRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              現金閾値
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.investmentThreshold)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">戦略</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium capitalize">
              {config.investmentStrategy}
            </p>
          </div>
          {config.investmentStrategy === "custom" && (
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                投資比率
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {(config.investmentRatio * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Housing Configuration */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            住宅設定
          </h3>
          <Button variant="ghost" size="sm">
            {housePurchase ? "編集" : "追加"}
          </Button>
        </div>
        {housePurchase ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                購入年齢
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {housePurchase.age}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                物件価格
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {formatCurrency(housePurchase.propertyPrice)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                頭金
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {formatCurrency(housePurchase.downPayment)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">ローン期間</p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {housePurchase.loanTerm}年
              </p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            住宅購入の設定がありません
          </p>
        )}
      </Card>

      {/* Data Management */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          データ管理
        </h3>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleReset}>
            デフォルトに戻す
          </Button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
          最終保存: ブラウザストレージに自動保存
        </p>
      </Card>
    </div>
  );
}
