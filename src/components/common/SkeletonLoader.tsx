import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="py-4 px-6">
          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};
