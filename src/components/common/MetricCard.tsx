import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  subText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  trendText,
  trendType = 'positive',
  subText,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}
      </div>

      <div className="mt-1">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>

      {(trendText || subText) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trendText && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trendType === 'positive'
                  ? 'text-emerald-600'
                  : trendType === 'negative'
                  ? 'text-rose-600'
                  : 'text-gray-500'
              }`}
            >
              {trendType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {trendText}
            </span>
          )}
          {subText && <span className="text-gray-400">{subText}</span>}
        </div>
      )}
    </div>
  );
};
