import React from 'react';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'BLOCKED' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  let config = {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    dot: 'bg-emerald-500',
    label: 'Active'
  };

  switch (norm) {
    case 'ACTIVE':
      config = { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500', label: 'Active' };
      break;
    case 'BLOCKED':
      config = { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500', label: 'Blocked' };
      break;
    case 'OPEN':
      config = { bg: 'bg-sky-50 text-sky-700 border-sky-200/60', dot: 'bg-sky-500', label: 'Open' };
      break;
    case 'IN_PROGRESS':
      config = { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500', label: 'In Progress' };
      break;
    case 'RESOLVED':
      config = { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500', label: 'Resolved' };
      break;
    case 'PREMIUM':
    case 'PRO':
      config = { bg: 'bg-purple-50 text-purple-700 border-purple-200/60', dot: 'bg-purple-500', label: norm };
      break;
    case 'FREE':
      config = { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400', label: 'Free' };
      break;
    default:
      config = { bg: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: status };
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
