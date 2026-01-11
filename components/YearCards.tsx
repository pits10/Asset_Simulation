"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";
import { useRef, useEffect } from "react";

export default function YearCards() {
  const { yearData, config, selectedAge, setSelectedAge } = useSimulationStore();
  const currentAgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初回レンダリング時に現在年齢のカードにスクロール
    if (currentAgeRef.current) {
      currentAgeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  return (
    <div className="bg-gray-50 py-6">
      <div className="px-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">年次カード</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {yearData.map((data) => {
            const isCurrent = data.age === config.currentAge;
            const isSelected = data.age === selectedAge;

            return (
              <div
                key={data.age}
                ref={isCurrent ? currentAgeRef : null}
                onClick={() => setSelectedAge(data.age)}
                className={`
                  flex-shrink-0 w-64 bg-white rounded-lg shadow-md border-2 p-4 cursor-pointer
                  transition-all duration-200 hover:shadow-lg
                  ${
                    isCurrent
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : isSelected
                      ? "border-blue-300"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {data.age}歳
                  </h3>
                  {isCurrent && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      現在
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">手取り</span>
                    <span className="font-semibold text-teal-600">
                      {formatCurrency(data.netIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">税・社保</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(
                        data.incomeTax + data.residentTax + data.socialInsurance
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支出</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(data.totalExpense)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">収支</span>
                      <span
                        className={`font-bold ${
                          data.cashFlow >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(data.cashFlow)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">現金</span>
                      <span className="font-semibold">
                        {formatCurrency(data.cash)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">投資</span>
                      <span className="font-semibold">
                        {formatCurrency(data.investment)}
                      </span>
                    </div>
                    {data.mortgageBalance > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>ローン残債</span>
                        <span className="font-semibold">
                          {formatCurrency(data.mortgageBalance)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
