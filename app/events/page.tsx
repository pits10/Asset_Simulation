"use client";

import React from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatCurrency } from "@/lib/utils/format";

const eventTypeLabels: Record<string, string> = {
  marriage: "結婚",
  childbirth: "出産",
  job_change: "転職",
  house_purchase: "住宅購入",
  custom: "その他",
};

export default function EventsPage() {
  const { lifeEvents } = useSimulationStore();

  // 年齢順にソート
  const sortedEvents = [...lifeEvents].sort((a, b) => a.age - b.age);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            ライフイベント
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            人生の重要イベントを管理
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          + イベント追加
        </button>
      </div>

      {/* Events Timeline */}
      {sortedEvents.length > 0 ? (
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Age Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {event.age}歳
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {event.label}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                        {eventTypeLabels[event.type] || event.type}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {event.description}
                      </p>
                    )}

                    {/* Impact Details */}
                    <div className="space-y-1 text-sm">
                      {event.salaryChange !== undefined && (
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="font-medium">年収変更:</span>{" "}
                          {formatCurrency(event.salaryChange)}
                        </div>
                      )}
                      {event.livingCostMultiplier !== undefined && (
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="font-medium">生活費変動:</span>{" "}
                          {((event.livingCostMultiplier - 1) * 100).toFixed(0)}%
                          {event.livingCostMultiplier > 1 ? "増加" : "減少"}
                        </div>
                      )}
                      {event.livingCostChange !== undefined && (
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="font-medium">生活費変更:</span>{" "}
                          {event.livingCostChange >= 0 ? "+" : ""}
                          {formatCurrency(event.livingCostChange)}
                        </div>
                      )}
                      {event.oneTimeCost !== undefined && (
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="font-medium">一時費用:</span>{" "}
                          {formatCurrency(event.oneTimeCost)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <svg
                      className="w-4 h-4 text-slate-600 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <svg
                      className="w-4 h-4 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            ライフイベントがありません
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            結婚、出産、転職などの重要なイベントを追加して、シミュレーションに反映させましょう。
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            最初のイベントを追加
          </button>
        </div>
      )}
    </div>
  );
}
