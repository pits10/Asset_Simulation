"use client";

import React, { useMemo } from "react";
import { KPICard } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";

export const KPICards: React.FC = () => {
  const { yearData, ageRangeEnd } = useSimulationStore();

  const kpiData = useMemo(() => {
    if (yearData.length === 0) {
      return null;
    }

    // Get latest year data (within range)
    const latestData = yearData.find((d) => d.age === ageRangeEnd) || yearData[yearData.length - 1];
    const previousData = yearData.find((d) => d.age === ageRangeEnd - 1) || yearData[yearData.length - 2];

    const calculateChange = (current: number, previous: number) => {
      if (!previous || previous === 0) return { value: "N/A", isPositive: true };
      const change = ((current - previous) / Math.abs(previous)) * 100;
      return {
        value: `${Math.abs(change).toFixed(1)}%`,
        isPositive: change >= 0,
      };
    };

    return {
      totalAssets: {
        value: formatCurrency(latestData.totalAssets),
        change: previousData
          ? calculateChange(latestData.totalAssets, previousData.totalAssets)
          : undefined,
      },
      netWorth: {
        value: formatCurrency(latestData.netWorth),
        change: previousData
          ? calculateChange(latestData.netWorth, previousData.netWorth)
          : undefined,
      },
      financialAssets: {
        value: formatCurrency(latestData.cash + latestData.investment),
        change: previousData
          ? calculateChange(
              latestData.cash + latestData.investment,
              previousData.cash + previousData.investment
            )
          : undefined,
      },
      investmentAssets: {
        value: formatCurrency(latestData.investment),
        change: previousData
          ? calculateChange(latestData.investment, previousData.investment)
          : undefined,
      },
      mortgageBalance: {
        value: formatCurrency(latestData.mortgageBalance || 0),
        change: previousData
          ? calculateChange(
              -(latestData.mortgageBalance || 0),
              -(previousData.mortgageBalance || 0)
            )
          : undefined,
      },
      netIncome: {
        value: formatCurrency(latestData.netIncome),
        change: previousData
          ? calculateChange(latestData.netIncome, previousData.netIncome)
          : undefined,
      },
    };
  }, [yearData, ageRangeEnd]);

  if (!kpiData) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        シミュレーションデータがありません。設定を確認してください。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <KPICard
        label="総資産"
        value={kpiData.totalAssets.value}
        change={kpiData.totalAssets.change}
      />
      <KPICard
        label="純資産"
        value={kpiData.netWorth.value}
        change={kpiData.netWorth.change}
      />
      <KPICard
        label="金融資産"
        value={kpiData.financialAssets.value}
        change={kpiData.financialAssets.change}
      />
      <KPICard
        label="投資資産"
        value={kpiData.investmentAssets.value}
        change={kpiData.investmentAssets.change}
      />
      <KPICard
        label="住宅ローン残高"
        value={kpiData.mortgageBalance.value}
        change={kpiData.mortgageBalance.change}
      />
      <KPICard
        label="年間純収入"
        value={kpiData.netIncome.value}
        change={kpiData.netIncome.change}
      />
    </div>
  );
};
