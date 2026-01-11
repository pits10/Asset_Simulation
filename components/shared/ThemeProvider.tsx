"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/lib/store/themeStore";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { updateResolvedTheme } = useThemeStore();

  useEffect(() => {
    updateResolvedTheme();
  }, [updateResolvedTheme]);

  return <>{children}</>;
};
