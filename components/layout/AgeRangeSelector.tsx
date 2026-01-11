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
      addToast("開始年齢は終了年齢より小さくしてください", "error");
      return;
    }

    if (tempStart < config.startAge || tempEnd > config.endAge) {
      addToast(
        `年齢範囲は${config.startAge}歳から${config.endAge}歳の間で設定してください`,
        "error"
      );
      return;
    }

    setAgeRange(tempStart, tempEnd);
    addToast("年齢範囲を更新しました", "success");
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
      title="年齢範囲を選択"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={closeModal}>
            キャンセル
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            デフォルトに戻す
          </Button>
          <Button variant="primary" onClick={handleSave}>
            適用
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          グラフに表示する年齢範囲を調整します。全ページのタイムライン表示に反映されます。
        </p>

        {/* Visual Range Display */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                開始年齢
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
                終了年齢
              </p>
              <p className="text-3xl font-bold text-blue-500 dark:text-blue-400 tabular-nums">
                {tempEnd}
              </p>
            </div>
          </div>

          {/* Range Info */}
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {tempEnd - tempStart}
              </span>
              年分のデータを表示
            </p>
          </div>
        </div>

        {/* Start Age Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            開始年齢
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
            終了年齢
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
            <strong>ヒント:</strong> 詳細分析には狭い範囲を、長期的な概要には広い範囲を設定してください。
          </p>
        </div>
      </div>
    </Modal>
  );
};
