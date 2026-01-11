"use client";

import React from "react";
import { Card, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatCurrency } from "@/lib/utils/format";

export default function SettingsPage() {
  const { config, housePurchase, resetToDefaults } = useSimulationStore();
  const { addToast } = useUIStore();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetToDefaults();
      addToast("Settings reset to defaults", "success");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Configure your financial simulation
        </p>
      </div>

      {/* Personal Information */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Personal Information
          </h3>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Start Age</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.startAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">End Age</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.endAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Current Age</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {config.currentAge}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Initial Cash</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.initialCash)}
            </p>
          </div>
        </div>
      </Card>

      {/* Income Settings */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Income Settings
          </h3>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Base Salary</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.baseSalary)}/year
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Annual Growth Rate
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.salaryGrowthRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Expense Settings */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Expense Settings
          </h3>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Base Living Cost
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.baseLivingCost)}/year
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Inflation Rate
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.livingCostInflationRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Investment Strategy */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Investment Strategy
          </h3>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Expected Return Rate
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {(config.investmentReturnRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Cash Threshold
            </p>
            <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
              {formatCurrency(config.investmentThreshold)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Strategy</p>
            <p className="text-slate-900 dark:text-slate-50 font-medium capitalize">
              {config.investmentStrategy}
            </p>
          </div>
          {config.investmentStrategy === "custom" && (
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                Investment Ratio
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {(config.investmentRatio * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Housing Configuration */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Housing Configuration
          </h3>
          <Button variant="ghost" size="sm">
            {housePurchase ? "Edit" : "Add"}
          </Button>
        </div>
        {housePurchase ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                Purchase Age
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {housePurchase.age}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                Property Price
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {formatCurrency(housePurchase.propertyPrice)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">
                Down Payment
              </p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {formatCurrency(housePurchase.downPayment)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Loan Term</p>
              <p className="text-slate-900 dark:text-slate-50 font-medium tabular-nums">
                {housePurchase.loanTerm} years
              </p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No house purchase configured
          </p>
        )}
      </Card>

      {/* Data Management */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Data Management
        </h3>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
          Last saved: Auto-saved to browser storage
        </p>
      </Card>
    </div>
  );
}
