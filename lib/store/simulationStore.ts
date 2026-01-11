import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SimulationConfig,
  HousePurchase,
  YearData,
  SimulationState,
  InvestmentStrategy,
} from "../types";
import { calculateSimulation, initializeYearData } from "../utils/calculations";

interface SimulationStore extends SimulationState {
  // 年次データの上書き情報
  yearDataOverrides: Map<number, Partial<YearData>>;

  // アクション
  updateConfig: (config: Partial<SimulationConfig>) => void;
  setHousePurchase: (purchase: HousePurchase | null) => void;
  updateYearData: (age: number, data: Partial<YearData>) => void;
  setSelectedAge: (age: number | null) => void;
  recalculate: () => void;
  resetToDefaults: () => void;
  importData: (data: string) => void;
  exportData: () => string;
}

// デフォルト設定
const defaultConfig: SimulationConfig = {
  startAge: 25,
  endAge: 90,
  currentAge: 30,
  initialCash: 1_000_000,
  initialInvestment: 0,
  investmentReturnRate: 0.05,
  investmentThreshold: 1_000_000,
  investmentStrategy: "threshold",
  investmentRatio: 0.5,
  baseSalary: 5_000_000,
  salaryGrowthRate: 0.02,
  baseLivingCost: 3_000_000,
  livingCostInflationRate: 0.01,
};

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      housePurchase: null,
      yearData: [],
      selectedAge: null,
      yearDataOverrides: new Map(),

      updateConfig: (newConfig) => {
        set((state) => ({
          config: { ...state.config, ...newConfig },
        }));
        get().recalculate();
      },

      setHousePurchase: (purchase) => {
        set({ housePurchase: purchase });
        get().recalculate();
      },

      updateYearData: (age, data) => {
        const { yearDataOverrides } = get();
        const existing = yearDataOverrides.get(age) || {};
        yearDataOverrides.set(age, { ...existing, ...data });
        set({ yearDataOverrides: new Map(yearDataOverrides) });
        get().recalculate();
      },

      setSelectedAge: (age) => {
        set({ selectedAge: age });
      },

      recalculate: () => {
        const { config, housePurchase, yearDataOverrides } = get();
        const yearData = calculateSimulation(
          config,
          housePurchase,
          yearDataOverrides
        );
        set({ yearData });
      },

      resetToDefaults: () => {
        set({
          config: defaultConfig,
          housePurchase: null,
          yearData: [],
          selectedAge: null,
          yearDataOverrides: new Map(),
        });
        get().recalculate();
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set({
            config: data.config || defaultConfig,
            housePurchase: data.housePurchase || null,
            yearDataOverrides: new Map(
              Object.entries(data.yearDataOverrides || {}).map(([k, v]) => [
                parseInt(k),
                v as Partial<YearData>,
              ])
            ),
          });
          get().recalculate();
        } catch (error) {
          console.error("Failed to import data:", error);
        }
      },

      exportData: () => {
        const { config, housePurchase, yearDataOverrides } = get();
        const data = {
          config,
          housePurchase,
          yearDataOverrides: Object.fromEntries(yearDataOverrides),
        };
        return JSON.stringify(data, null, 2);
      },
    }),
    {
      name: "asset-simulation-storage",
      partialize: (state) => ({
        config: state.config,
        housePurchase: state.housePurchase,
        yearDataOverrides: Object.fromEntries(state.yearDataOverrides),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // localStorage から復元後に yearDataOverrides を Map に変換
          state.yearDataOverrides = new Map(
            Object.entries(
              (state.yearDataOverrides as unknown as Record<
                string,
                Partial<YearData>
              >) || {}
            ).map(([k, v]) => [parseInt(k), v])
          );
          state.recalculate();
        }
      },
    }
  )
);
