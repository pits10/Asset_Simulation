// 投資戦略タイプ
export type InvestmentStrategy = "threshold" | "all" | "custom";

// グローバル設定
export interface SimulationConfig {
  // 年齢範囲
  startAge: number;
  endAge: number;
  currentAge: number;

  // 金融資産初期値
  initialCash: number;
  initialInvestment: number;
  investmentReturnRate: number; // 年率（例: 0.05 = 5%）

  // 余剰投資ルール
  investmentThreshold: number; // 現金閾値
  investmentStrategy: InvestmentStrategy;
  investmentRatio: number; // custom時の投資割合（0〜1）

  // 給与（ルールベース）
  baseSalary: number; // ベース年収（額面）
  salaryGrowthRate: number; // 年間成長率（例: 0.02 = 2%）

  // 生活費（ルールベース）
  baseLivingCost: number; // ベース生活費（年額）
  livingCostInflationRate: number; // インフレ率（例: 0.01 = 1%）
}

// 住宅購入イベント
export interface HousePurchase {
  age: number; // 購入年齢
  propertyPrice: number; // 物件価格
  downPayment: number; // 頭金
  loanAmount: number; // 借入額
  interestRate: number; // 年利（例: 0.015 = 1.5%）
  loanTerm: number; // 返済期間（年）

  // 諸費用・税金など
  acquisitionCostRate: number; // 諸費用率（例: 0.07 = 7%）
  propertyTaxRate: number; // 固定資産税率（例: 0.014 = 1.4%）
  annualMaintenanceCost: number; // 年間修繕費
  propertyAppreciationRate: number; // 価格変動率（例: 0.01 = 1%/年）
}

// 年次データ
export interface YearData {
  age: number;

  // 収入（上書き可能、nullはルールから自動計算）
  salary: number | null;

  // 支出（上書き可能）
  livingCost: number | null; // nullはルールから自動計算
  entertainmentCost: number; // 娯楽費
  investmentContribution: number; // 積立投資額

  // 住宅ローン（自動計算）
  mortgagePayment: number; // 年間返済額（元利合計）
  mortgageInterest: number; // うち利息部分
  mortgagePrincipal: number; // うち元金部分
  mortgageBalance: number; // 残債

  // その他費用（住宅関連）
  propertyTax: number; // 固定資産税
  maintenanceCost: number; // 修繕費

  // 計算結果（自動生成）
  grossIncome: number; // 総収入（額面）
  incomeTax: number; // 所得税
  residentTax: number; // 住民税
  socialInsurance: number; // 社会保険料
  netIncome: number; // 手取り
  totalExpense: number; // 総支出
  cashFlow: number; // 年次収支（手取り - 支出）

  // 資産（期末）
  cash: number; // 現金残高
  investment: number; // 投資資産残高
  propertyValue: number; // 不動産評価額
  totalAssets: number; // 総資産
  totalLiabilities: number; // 総負債
  netWorth: number; // 純資産
}

// アプリ全体の状態
export interface SimulationState {
  config: SimulationConfig;
  housePurchase: HousePurchase | null;
  yearData: YearData[];
  selectedAge: number | null; // 右パネルで編集中の年齢
}
