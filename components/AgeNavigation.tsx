"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { useRef, useEffect } from "react";

export default function AgeNavigation() {
  const { config, setSelectedAge, selectedAge } = useSimulationStore();
  const currentAgeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 初回レンダリング時に現在年齢にスクロール
    if (currentAgeRef.current) {
      currentAgeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  const ages = Array.from(
    { length: config.endAge - config.startAge + 1 },
    (_, i) => config.startAge + i
  );

  return (
    <div className="sticky top-[145px] z-40 bg-gray-50 border-b border-gray-200 py-3 px-6">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
        <span className="text-sm text-gray-600 font-medium whitespace-nowrap mr-2">
          年齢:
        </span>
        {ages.map((age) => {
          const isCurrent = age === config.currentAge;
          const isSelected = age === selectedAge;

          return (
            <button
              key={age}
              ref={isCurrent ? currentAgeRef : null}
              onClick={() => setSelectedAge(age)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2"
                    : isSelected
                    ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {age}
            </button>
          );
        })}
      </div>
    </div>
  );
}
