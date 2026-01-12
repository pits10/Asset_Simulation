"use client";

import React, { useMemo } from "react";
import { KPICard } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";

export const KPICards: React.FC = () => {
  const { yearData, ageRangeEnd, ageRangeStart, config } = useSimulationStore();

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

    // Calculate FIRE age using 4% rule
    // FIRE達成 = 投資資産 × 4% >= 年間生活費
    const fireData = yearData.find((d) => {
      const annualExpenses = d.livingCost || 0;
      const safeWithdrawal = d.investment * 0.04;
      return safeWithdrawal >= annualExpenses && d.age >= config.currentAge;
    });
    const fireAge = fireData?.age;

    // Calculate CAGR (Compound Annual Growth Rate)
    const displayYearData = yearData.filter(
      (d) => d.age >= ageRangeStart && d.age <= ageRangeEnd
    );
    const firstData = displayYearData[0];
    const lastData = displayYearData[displayYearData.length - 1];
    const years = displayYearData.length;
    const initialAssets = firstData ? firstData.cash + firstData.investment : 0;
    const finalAssets = lastData ? lastData.cash + lastData.investment : 0;

    const cagr =
      years > 1 && initialAssets > 0
        ? ((Math.pow(finalAssets / initialAssets, 1 / years) - 1) * 100)
        : 0;

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
      fireAge: {
        value: fireAge ? `${fireAge}歳` : "未達成",
        isAchieved: !!fireAge,
      },
      cagr: {
        value: `${cagr.toFixed(2)}%`,
        rawValue: cagr,
      },
    };
  }, [yearData, ageRangeEnd, ageRangeStart, config]);

  if (!kpiData) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        シミュレーションデータがありません。設定を確認してください。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Row 1 */}
      <KPICard
        label="純資産"
        value={kpiData.netWorth.value}
        change={kpiData.netWorth.change}
      />
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg p-4 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-1">FIRE達成年齢</p>
        <p className="text-3xl font-bold tabular-nums">
          {kpiData.fireAge.value}
        </p>
        {kpiData.fireAge.isAchieved && (
          <p className="text-xs opacity-75 mt-2">
            4%ルールで達成可能
          </p>
        )}
      </div>
      <KPICard
        label="年平均成長率"
        value={kpiData.cagr.value}
        change={kpiData.cagr.rawValue >= 0 ? {
          value: "成長中",
          isPositive: true
        } : undefined}
      />
      <KPICard
        label="投資資産"
        value={kpiData.investmentAssets.value}
        change={kpiData.investmentAssets.change}
      />

      {/* Row 2 */}
      <KPICard
        label="総資産"
        value={kpiData.totalAssets.value}
        change={kpiData.totalAssets.change}
      />
      <KPICard
        label="金融資産"
        value={kpiData.financialAssets.value}
        change={kpiData.financialAssets.change}
      />
      <KPICard
        label="年間純収入"
        value={kpiData.netIncome.value}
        change={kpiData.netIncome.change}
      />
      <KPICard
        label="住宅ローン残高"
        value={kpiData.mortgageBalance.value}
        change={kpiData.mortgageBalance.change}
      />
    </div>
  );
};
