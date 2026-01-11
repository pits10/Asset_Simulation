"use client";

import React from "react";
import { Card } from "@/components/shared";

export default function AssetsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Assets
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Detailed asset composition and growth
        </p>
      </div>

      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            Assets view coming soon...
          </p>
        </div>
      </Card>
    </div>
  );
}
