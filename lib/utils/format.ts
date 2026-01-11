/**
 * 数値を通貨形式でフォーマット（万円表示）
 */
export function formatCurrency(value: number, unit: "万円" | "円" = "万円"): string {
  if (unit === "万円") {
    return `${(value / 10_000).toFixed(0)}万円`;
  }
  return `${value.toLocaleString()}円`;
}

/**
 * パーセンテージ表示
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * 数値を3桁区切りでフォーマット
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}
