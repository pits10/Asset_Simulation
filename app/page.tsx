"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import Header from "@/components/Header";
import AgeNavigation from "@/components/AgeNavigation";
import MainCharts from "@/components/MainCharts";
import YearCards from "@/components/YearCards";
import SidePanel from "@/components/SidePanel";
import PLBSTable from "@/components/PLBSTable";

export default function Home() {
  const { recalculate, yearData } = useSimulationStore();

  useEffect(() => {
    // 初回レンダリング時に計算を実行
    if (yearData.length === 0) {
      recalculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* メインエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <AgeNavigation />

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <MainCharts />
            <YearCards />
            <PLBSTable />
          </div>
        </div>
      </div>

      {/* 右サイドパネル */}
      <SidePanel />
    </div>
  );
}
