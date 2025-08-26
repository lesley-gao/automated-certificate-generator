import React from 'react';

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-200 rounded h-4 mt-2">
      <div
        className="bg-blue-500 h-4 rounded"
        style={{ width: `${percent}%` }}
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={0}
        role="progressbar"
      />
      <span className="text-xs text-gray-600 ml-2">{percent}%</span>
    </div>
  );
}
