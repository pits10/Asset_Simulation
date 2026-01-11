import type {
  SimulationConfig,
  HousePurchase,
  YearData,
  LifeEvent,
} from "../types";

/**
 * 給与所得控除を計算（2020年以降の新制度に基づく簡易版）
 */
export function calculateEmploymentIncomeDeduction(
  grossIncome: number
): number {
  if (grossIncome <= 1_625_000) {
    return 550_000;
  } else if (grossIncome <= 1_800_000) {
    return grossIncome * 0.4 - 100_000;
  } else if (grossIncome <= 3_600_000) {
    return grossIncome * 0.3 + 80_000;
  } else if (grossIncome <= 6_600_000) {
    return grossIncome * 0.2 + 440_000;
  } else if (grossIncome <= 8_500_000) {
    return grossIncome * 0.1 + 1_100_000;
  } else {
    return 1_950_000;
  }
}

/**
 * 所得税を計算（日本の累進課税に基づく詳細版）
 */
export function calculateIncomeTax(grossIncome: number): number {
  const employmentDeduction = calculateEmploymentIncomeDeduction(grossIncome);
  const basicDeduction = 480_000; // 基礎控除
  const taxableIncome = Math.max(
    0,
    grossIncome - employmentDeduction - basicDeduction
  );

  let tax = 0;

  if (taxableIncome <= 1_950_000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3_300_000) {
    tax = 1_950_000 * 0.05 + (taxableIncome - 1_950_000) * 0.1;
  } else if (taxableIncome <= 6_950_000) {
    tax =
      1_950_000 * 0.05 +
      (3_300_000 - 1_950_000) * 0.1 +
      (taxableIncome - 3_300_000) * 0.2;
  } else if (taxableIncome <= 9_000_000) {
    tax =
      1_950_000 * 0.05 +
      (3_300_000 - 1_950_000) * 0.1 +
      (6_950_000 - 3_300_000) * 0.2 +
      (taxableIncome - 6_950_000) * 0.23;
  } else if (taxableIncome <= 18_000_000) {
    tax =
      1_950_000 * 0.05 +
      (3_300_000 - 1_950_000) * 0.1 +
      (6_950_000 - 3_300_000) * 0.2 +
      (9_000_000 - 6_950_000) * 0.23 +
      (taxableIncome - 9_000_000) * 0.33;
  } else {
    tax =
      1_950_000 * 0.05 +
      (3_300_000 - 1_950_000) * 0.1 +
      (6_950_000 - 3_300_000) * 0.2 +
      (9_000_000 - 6_950_000) * 0.23 +
      (18_000_000 - 9_000_000) * 0.33 +
      (taxableIncome - 18_000_000) * 0.4;
  }

  return Math.round(tax);
}

/**
 * 住民税を計算
 */
export function calculateResidentTax(grossIncome: number): number {
  const employmentDeduction = calculateEmploymentIncomeDeduction(grossIncome);
  const basicDeduction = 430_000; // 住民税の基礎控除
  const taxableIncome = Math.max(
    0,
    grossIncome - employmentDeduction - basicDeduction
  );

  // 住民税率は一律10%
  return Math.round(taxableIncome * 0.1);
}

/**
 * 社会保険料を計算（簡易版）
 */
export function calculateSocialInsurance(grossIncome: number): number {
  // 健康保険 + 厚生年金の概算（約14.5%）
  return Math.round(grossIncome * 0.145);
}

/**
 * 税・社会保険料を計算し、手取りを算出
 */
export function calculateNetIncome(grossIncome: number): {
  incomeTax: number;
  residentTax: number;
  socialInsurance: number;
  netIncome: number;
} {
  const incomeTax = calculateIncomeTax(grossIncome);
  const residentTax = calculateResidentTax(grossIncome);
  const socialInsurance = calculateSocialInsurance(grossIncome);

  const netIncome = grossIncome - incomeTax - residentTax - socialInsurance;

  return {
    incomeTax,
    residentTax,
    socialInsurance,
    netIncome,
  };
}

/**
 * 住宅ローンの年間返済スケジュールを計算（元利均等）
 * @returns 各年の返済情報の配列
 */
export function calculateMortgageSchedule(purchase: HousePurchase): {
  age: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}[] {
  const { age, loanAmount, interestRate, loanTerm } = purchase;

  // 月利と返済回数
  const monthlyRate = interestRate / 12;
  const numPayments = loanTerm * 12;

  // 月々の返済額（元利均等）
  let monthlyPayment = 0;
  if (interestRate > 0) {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }

  const schedule: {
    age: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
  }[] = [];

  let remainingBalance = loanAmount;

  for (let year = 0; year < loanTerm; year++) {
    let annualInterest = 0;
    let annualPrincipal = 0;

    for (let month = 0; month < 12; month++) {
      if (remainingBalance <= 0) break;

      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = monthlyPayment - monthlyInterest;

      annualInterest += monthlyInterest;
      annualPrincipal += monthlyPrincipal;

      remainingBalance -= monthlyPrincipal;
    }

    remainingBalance = Math.max(0, remainingBalance);

    schedule.push({
      age: age + year,
      payment: Math.round(annualInterest + annualPrincipal),
      interest: Math.round(annualInterest),
      principal: Math.round(annualPrincipal),
      balance: Math.round(remainingBalance),
    });
  }

  return schedule;
}

/**
 * ルールベースの給与計算（成長率を考慮）
 */
export function calculateSalary(
  config: SimulationConfig,
  age: number
): number {
  const yearsFromStart = age - config.startAge;
  return Math.round(
    config.baseSalary * Math.pow(1 + config.salaryGrowthRate, yearsFromStart)
  );
}

/**
 * ルールベースの生活費計算（インフレ率を考慮）
 */
export function calculateLivingCost(
  config: SimulationConfig,
  age: number
): number {
  const yearsFromStart = age - config.startAge;
  return Math.round(
    config.baseLivingCost *
      Math.pow(1 + config.livingCostInflationRate, yearsFromStart)
  );
}

/**
 * 年次データの初期化（計算前のデフォルト値）
 */
export function initializeYearData(age: number): YearData {
  return {
    age,
    salary: null,
    livingCost: null,
    entertainmentCost: 0,
    otherExpenses: 0,
    otherExpensesMemo: "",
    investmentContribution: 0,
    mortgagePayment: 0,
    mortgageInterest: 0,
    mortgagePrincipal: 0,
    mortgageBalance: 0,
    propertyTax: 0,
    maintenanceCost: 0,
    grossIncome: 0,
    incomeTax: 0,
    residentTax: 0,
    socialInsurance: 0,
    netIncome: 0,
    totalExpense: 0,
    cashFlow: 0,
    cash: 0,
    investment: 0,
    propertyValue: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
  };
}

/**
 * 全年次のシミュレーション計算
 */
export function calculateSimulation(
  config: SimulationConfig,
  housePurchase: HousePurchase | null,
  lifeEvents: LifeEvent[],
  yearDataOverrides: Map<number, Partial<YearData>>
): YearData[] {
  const results: YearData[] = [];
  const mortgageSchedule = housePurchase
    ? calculateMortgageSchedule(housePurchase)
    : [];

  // 住宅ローンスケジュールをマップ化
  const mortgageMap = new Map(
    mortgageSchedule.map((item) => [item.age, item])
  );

  // ライフイベントを年齢でグループ化
  const lifeEventsByAge = new Map<number, LifeEvent[]>();
  lifeEvents.forEach((event) => {
    const events = lifeEventsByAge.get(event.age) || [];
    events.push(event);
    lifeEventsByAge.set(event.age, events);
  });

  // 前年の資産状態
  let prevCash = config.initialCash;
  let prevInvestment = config.initialInvestment;
  let prevPropertyValue = 0;

  // ライフイベントによる累積的な変更を追跡
  let cumulativeSalaryChange = 0;
  let cumulativeLivingCostMultiplier = 1.0;
  let cumulativeLivingCostChange = 0;

  for (let age = config.startAge; age <= config.endAge; age++) {
    const yearData = initializeYearData(age);
    const override = yearDataOverrides.get(age);
    const eventsThisYear = lifeEventsByAge.get(age) || [];

    // ライフイベントの影響を適用
    eventsThisYear.forEach((event) => {
      if (event.salaryChange !== undefined) {
        cumulativeSalaryChange = event.salaryChange; // 絶対値で上書き
      }
      if (event.livingCostMultiplier !== undefined) {
        cumulativeLivingCostMultiplier *= event.livingCostMultiplier;
      }
      if (event.livingCostChange !== undefined) {
        cumulativeLivingCostChange += event.livingCostChange;
      }
    });

    // 1. 収入の計算
    let grossIncome = override?.salary ?? calculateSalary(config, age);

    // ライフイベントの影響を反映（年収変更がある場合は上書き）
    if (cumulativeSalaryChange > 0) {
      grossIncome = cumulativeSalaryChange;
    }

    yearData.grossIncome = grossIncome;
    yearData.salary = grossIncome;

    const { incomeTax, residentTax, socialInsurance, netIncome } =
      calculateNetIncome(grossIncome);
    yearData.incomeTax = incomeTax;
    yearData.residentTax = residentTax;
    yearData.socialInsurance = socialInsurance;
    yearData.netIncome = netIncome;

    // 2. 支出の計算
    let livingCost = override?.livingCost ?? calculateLivingCost(config, age);

    // ライフイベントの影響を反映
    livingCost =
      livingCost * cumulativeLivingCostMultiplier + cumulativeLivingCostChange;

    yearData.livingCost = Math.round(livingCost);
    yearData.entertainmentCost = override?.entertainmentCost ?? 0;
    yearData.otherExpenses = override?.otherExpenses ?? 0;
    yearData.otherExpensesMemo = override?.otherExpensesMemo ?? "";
    yearData.investmentContribution = override?.investmentContribution ?? 0;

    // ライフイベントの一時費用を追加
    let oneTimeCosts = 0;
    eventsThisYear.forEach((event) => {
      if (event.oneTimeCost) {
        oneTimeCosts += event.oneTimeCost;
      }
    });

    // 住宅ローン
    const mortgage = mortgageMap.get(age);
    if (mortgage) {
      yearData.mortgagePayment = mortgage.payment;
      yearData.mortgageInterest = mortgage.interest;
      yearData.mortgagePrincipal = mortgage.principal;
      yearData.mortgageBalance = mortgage.balance;
    }

    // 住宅関連費用
    if (housePurchase && age >= housePurchase.age) {
      yearData.propertyTax = Math.round(
        housePurchase.propertyPrice * housePurchase.propertyTaxRate
      );
      yearData.maintenanceCost = housePurchase.annualMaintenanceCost;
    }

    yearData.totalExpense =
      yearData.livingCost +
      yearData.entertainmentCost +
      yearData.otherExpenses +
      oneTimeCosts +
      yearData.investmentContribution +
      yearData.mortgagePayment +
      yearData.propertyTax +
      yearData.maintenanceCost;

    // 3. 収支の計算
    yearData.cashFlow = netIncome - yearData.totalExpense;

    // 4. 金融資産の更新
    let cash = prevCash;
    let investment = prevInvestment;

    // 投資資産の運用益を先に計算
    investment = Math.round(investment * (1 + config.investmentReturnRate));

    // 積立投資を投資資産に追加
    investment += yearData.investmentContribution;

    // 収支を反映
    if (yearData.cashFlow >= 0) {
      // プラスの場合：余剰投資ルールに従う
      cash += yearData.cashFlow;

      if (config.investmentStrategy === "threshold") {
        // 閾値超過分のみ投資
        if (cash > config.investmentThreshold) {
          const surplus = cash - config.investmentThreshold;
          investment += surplus;
          cash = config.investmentThreshold;
        }
      } else if (config.investmentStrategy === "all") {
        // 全額投資
        investment += yearData.cashFlow;
        cash -= yearData.cashFlow;
      } else if (config.investmentStrategy === "custom") {
        // 任意割合
        const toInvest = Math.round(
          yearData.cashFlow * config.investmentRatio
        );
        investment += toInvest;
        cash -= toInvest;
      }
    } else {
      // マイナスの場合：現金→投資の順で取り崩し
      const deficit = Math.abs(yearData.cashFlow);
      if (cash >= deficit) {
        cash -= deficit;
      } else {
        const remaining = deficit - cash;
        cash = 0;
        investment = Math.max(0, investment - remaining);
      }
    }

    yearData.cash = Math.round(cash);
    yearData.investment = Math.round(investment);

    // 5. 住宅資産の更新
    if (housePurchase && age >= housePurchase.age) {
      const yearsFromPurchase = age - housePurchase.age;
      yearData.propertyValue = Math.round(
        housePurchase.propertyPrice *
          Math.pow(1 + housePurchase.propertyAppreciationRate, yearsFromPurchase)
      );
    } else {
      yearData.propertyValue = 0;
    }

    // 住宅購入時の諸費用を初年度の現金から引く
    if (housePurchase && age === housePurchase.age) {
      const acquisitionCost = Math.round(
        housePurchase.propertyPrice * housePurchase.acquisitionCostRate
      );
      const totalInitialCost = housePurchase.downPayment + acquisitionCost;

      // 現金から差し引く
      if (yearData.cash >= totalInitialCost) {
        yearData.cash -= totalInitialCost;
      } else {
        // 現金が不足する場合、投資資産からも取り崩す
        const shortage = totalInitialCost - yearData.cash;
        yearData.cash = 0;
        yearData.investment = Math.max(0, yearData.investment - shortage);
      }
    }

    // 6. BS計算
    yearData.totalAssets =
      yearData.cash + yearData.investment + yearData.propertyValue;
    yearData.totalLiabilities = yearData.mortgageBalance;
    yearData.netWorth = yearData.totalAssets - yearData.totalLiabilities;

    results.push(yearData);

    // 次年度のために保存
    prevCash = yearData.cash;
    prevInvestment = yearData.investment;
    prevPropertyValue = yearData.propertyValue;
  }

  return results;
}
