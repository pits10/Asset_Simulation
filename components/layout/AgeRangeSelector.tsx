"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button } from "@/components/shared";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { useUIStore } from "@/lib/store/uiStore";

export const AgeRangeSelector: React.FC = () => {
  const { ageRangeStart, ageRangeEnd, config, setAgeRange } =
    useSimulationStore();
  const { activeModal, closeModal, addToast } = useUIStore();

  const [tempStart, setTempStart] = useState(ageRangeStart);
  const [tempEnd, setTempEnd] = useState(ageRangeEnd);

  const isOpen = activeModal === "age-range";

  useEffect(() => {
    if (isOpen) {
      setTempStart(ageRangeStart);
      setTempEnd(ageRangeEnd);
    }
  }, [isOpen, ageRangeStart, ageRangeEnd]);

  const handleSave = () => {
    if (tempStart >= tempEnd) {
      addToast("Start age must be less than end age", "error");
      return;
    }

    if (tempStart < config.startAge || tempEnd > config.endAge) {
      addToast(
        `Age range must be between ${config.startAge} and ${config.endAge}`,
        "error"
      );
      return;
    }

    setAgeRange(tempStart, tempEnd);
    addToast("Age range updated", "success");
    closeModal();
  };

  const handleReset = () => {
    setTempStart(24);
    setTempEnd(70);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Select Age Range"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Apply
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Adjust the age range to display in charts. This will filter the
          timeline view across all pages.
        </p>

        {/* Visual Range Display */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Start Age
              </p>
              <p className="text-3xl font-bold text-blue-500 dark:text-blue-400 tabular-nums">
                {tempStart}
              </p>
            </div>
            <div className="flex-1 mx-4 h-1 bg-blue-200 dark:bg-blue-900 rounded-full relative">
              <div
                className="absolute h-full bg-blue-500 dark:bg-blue-600 rounded-full"
                style={{
                  left: `${((tempStart - config.startAge) / (config.endAge - config.startAge)) * 100}%`,
                  right: `${100 - ((tempEnd - config.startAge) / (config.endAge - config.startAge)) * 100}%`,
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                End Age
              </p>
              <p className="text-3xl font-bold text-blue-500 dark:text-blue-400 tabular-nums">
                {tempEnd}
              </p>
            </div>
          </div>

          {/* Range Info */}
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Displaying{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {tempEnd - tempStart}
              </span>{" "}
              years of data
            </p>
          </div>
        </div>

        {/* Start Age Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start Age
          </label>
          <input
            type="range"
            min={config.startAge}
            max={tempEnd - 1}
            value={tempStart}
            onChange={(e) => setTempStart(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {config.startAge}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {tempEnd - 1}
            </span>
          </div>
        </div>

        {/* End Age Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            End Age
          </label>
          <input
            type="range"
            min={tempStart + 1}
            max={config.endAge}
            value={tempEnd}
            onChange={(e) => setTempEnd(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {tempStart + 1}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {config.endAge}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Use a narrower range for detailed analysis, or
            expand it for long-term overview.
          </p>
        </div>
      </div>
    </Modal>
  );
};
