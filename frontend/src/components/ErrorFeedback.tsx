import React from 'react';

export default function ErrorFeedback({ error, onRetry }: { error: string | null; onRetry?: () => void }) {
  if (!error) return null;
  return (
    <div className="bg-red-100 text-red-700 p-2 rounded mb-2 flex items-center justify-between">
      <span>{error}</span>
      {onRetry && (
        <button className="ml-4 px-2 py-1 bg-red-200 rounded" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
