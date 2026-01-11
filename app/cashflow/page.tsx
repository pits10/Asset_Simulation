"use client";

import React from "react";
import { Card } from "@/components/shared";

export default function CashflowPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          キャッシュフロー
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          収入・支出とキャッシュフローの分析
        </p>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            キャッシュフローの詳細ビューは現在準備中です
          </p>
        </div>
      </Card>
    </div>
  );
}
