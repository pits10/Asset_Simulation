import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;

  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateResolvedTheme: () => void;
}

// システムのテーマ設定を取得
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// テーマをDOMに適用
const applyTheme = (theme: ResolvedTheme) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);

  // メタテーマカラーも更新
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      theme === "dark" ? "#0F172A" : "#F8FAFC"
    );
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolvedTheme: "light",

      setMode: (mode) => {
        set({ mode });
        get().updateResolvedTheme();
      },

      toggleTheme: () => {
        const { mode } = get();
        const newMode: ThemeMode = mode === "dark" ? "light" : "dark";
        set({ mode: newMode });
        get().updateResolvedTheme();
      },

      updateResolvedTheme: () => {
        const { mode } = get();
        const resolved =
          mode === "system" ? getSystemTheme() : mode;
        set({ resolvedTheme: resolved });
        applyTheme(resolved);
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateResolvedTheme();
        }
      },
    }
  )
);

// システムテーマ変更を監視
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const store = useThemeStore.getState();
      if (store.mode === "system") {
        store.updateResolvedTheme();
      }
    });
}
