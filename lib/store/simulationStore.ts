import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SimulationConfig,
  HousePurchase,
  YearData,
  SimulationState,
  InvestmentStrategy,
  LifeEvent,
} from "../types";
import { calculateSimulation, initializeYearData } from "../utils/calculations";

interface OnboardingData {
  name: string;
  currentAge: number;
  annualSalary: number;
  currentAssets: number;
  annualInvestment: number;
}

interface SimulationStore extends SimulationState {
  // 年次データの上書き情報
  yearDataOverrides: Map<number, Partial<YearData>>;

  // UI state: Age range for chart display
  ageRangeStart: number;
  ageRangeEnd: number;

  // アクション
  updateConfig: (config: Partial<SimulationConfig>) => void;
  setHousePurchase: (purchase: HousePurchase | null) => void;
  addLifeEvent: (event: LifeEvent) => void;
  updateLifeEvent: (id: string, event: Partial<LifeEvent>) => void;
  deleteLifeEvent: (id: string) => void;
  updateYearData: (age: number, data: Partial<YearData>) => void;
  setSelectedAge: (age: number | null) => void;
  setAgeRange: (start: number, end: number) => void;
  recalculate: () => void;
  resetToDefaults: () => void;
  importData: (data: string) => void;
  exportData: () => string;
  initializeFromOnboarding: (data: OnboardingData) => void;
  isFirstTimeUser: () => boolean;
}

// デフォルト設定
const defaultConfig: SimulationConfig = {
  userName: "山田 太郎",
  startAge: 18,
  endAge: 60,
  currentAge: 30,
  defaultDisplayStartAge: 24,
  defaultDisplayEndAge: 50,
  initialCash: 3_000_000,
  initialInvestment: 2_000_000,
  investmentReturnRate: 0.05,
  investmentThreshold: 1_000_000,
  investmentStrategy: "threshold",
  investmentRatio: 0.7,
  baseSalary: 4_000_000,
  salaryGrowthRate: 0.02,
  baseLivingCost: 3_000_000,
  livingCostInflationRate: 0.01,
};

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      housePurchase: null,
      lifeEvents: [],
      yearData: [],
      selectedAge: null,
      yearDataOverrides: new Map(),
      ageRangeStart: 24,
      ageRangeEnd: 50,

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

      addLifeEvent: (event) => {
        set((state) => ({
          lifeEvents: [...state.lifeEvents, event],
        }));
        get().recalculate();
      },

      updateLifeEvent: (id, eventUpdate) => {
        set((state) => ({
          lifeEvents: state.lifeEvents.map((e) =>
            e.id === id ? { ...e, ...eventUpdate } : e
          ),
        }));
        get().recalculate();
      },

      deleteLifeEvent: (id) => {
        set((state) => ({
          lifeEvents: state.lifeEvents.filter((e) => e.id !== id),
        }));
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

      setAgeRange: (start, end) => {
        // 自動補正：start > end の場合は入れ替え
        if (start > end) {
          [start, end] = [end, start];
        }
        // 範囲チェック：18〜60歳にclamp
        start = Math.max(18, Math.min(60, start));
        end = Math.max(18, Math.min(60, end));

        set({ ageRangeStart: start, ageRangeEnd: end });
      },

      recalculate: () => {
        const { config, housePurchase, lifeEvents, yearDataOverrides } = get();
        const yearData = calculateSimulation(
          config,
          housePurchase,
          lifeEvents,
          yearDataOverrides
        );
        set({ yearData });
      },

      resetToDefaults: () => {
        set({
          config: defaultConfig,
          housePurchase: null,
          lifeEvents: [],
          yearData: [],
          selectedAge: null,
          yearDataOverrides: new Map(),
          ageRangeStart: 24,
          ageRangeEnd: 50,
        });
        get().recalculate();
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set({
            config: data.config || defaultConfig,
            housePurchase: data.housePurchase || null,
            lifeEvents: data.lifeEvents || [],
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
        const { config, housePurchase, lifeEvents, yearDataOverrides } = get();
        const data = {
          config,
          housePurchase,
          lifeEvents,
          yearDataOverrides: Object.fromEntries(yearDataOverrides),
        };
        return JSON.stringify(data, null, 2);
      },

      initializeFromOnboarding: (data) => {
        const newConfig: SimulationConfig = {
          userName: data.name,
          startAge: data.currentAge,
          endAge: 65,
          currentAge: data.currentAge,
          defaultDisplayStartAge: data.currentAge,
          defaultDisplayEndAge: Math.min(data.currentAge + 30, 65),
          initialCash: Math.round(data.currentAssets * 0.3),
          initialInvestment: Math.round(data.currentAssets * 0.7),
          investmentReturnRate: 0.05,
          investmentThreshold: Math.round(data.annualSalary * 0.5),
          investmentStrategy: "threshold",
          investmentRatio: 0.7,
          baseSalary: data.annualSalary,
          salaryGrowthRate: 0.02,
          baseLivingCost: Math.round(data.annualSalary * 0.6),
          livingCostInflationRate: 0.01,
        };

        set({
          config: newConfig,
          housePurchase: null,
          lifeEvents: [],
          yearDataOverrides: new Map(),
          ageRangeStart: data.currentAge,
          ageRangeEnd: Math.min(data.currentAge + 30, 65),
        });
        get().recalculate();
      },

      isFirstTimeUser: () => {
        const { config } = get();
        return config.userName === "山田 太郎";
      },
    }),
    {
      name: "asset-simulation-storage",
      partialize: (state) => ({
        config: state.config,
        housePurchase: state.housePurchase,
        lifeEvents: state.lifeEvents,
        yearDataOverrides: Object.fromEntries(state.yearDataOverrides),
        ageRangeStart: state.ageRangeStart,
        ageRangeEnd: state.ageRangeEnd,
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
