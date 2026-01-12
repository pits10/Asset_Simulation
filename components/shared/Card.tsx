import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  padding = "md",
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const hoverStyles = hover
    ? "hover:shadow-md dark:hover:shadow-slate-900/50 cursor-pointer"
    : "";

  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        rounded-lg
        transition-all duration-200
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface KPICardProps {
  label: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  icon,
}) => {
  return (
    <Card padding="md" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {change.isPositive ? "↑" : "↓"} {change.value}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                YoY
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-brand-500 dark:text-brand-400 opacity-75">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
