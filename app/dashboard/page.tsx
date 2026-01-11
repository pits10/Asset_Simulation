"use client";

import React, { useEffect } from "react";
import {
  KPICards,
  AssetGrowthChart,
  CashflowBarChart,
  AssetCompositionChart,
} from "@/components/dashboard";
import { useSimulationStore } from "@/lib/store/simulationStore";

export default function DashboardPage() {
  const { yearData, recalculate } = useSimulationStore();

  useEffect(() => {
    if (yearData.length === 0) {
      recalculate();
    }
  }, [yearData.length, recalculate]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          ダッシュボード
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          資産シミュレーションの概要
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Primary Asset Growth Chart */}
      <AssetGrowthChart />

      {/* Bottom Grid: Cashflow + Composition */}
      <div className="grid grid-cols-2 gap-6">
        <CashflowBarChart />
        <AssetCompositionChart />
      </div>
    </div>
  );
}
