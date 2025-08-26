import React, { useRef, useState } from 'react';
import ErrorFeedback from '../ErrorFeedback';

export default function ImportRecipients() {
  const [error, setError] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError('Please upload a CSV or Excel file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      // Simple CSV parsing (stub)
      const lines = text.split(/\r?\n/).filter(Boolean);
      setRecipients(lines);
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(file);
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Import Recipients (CSV/Excel)</h2>
      <input
        type="file"
        accept=".csv,.xlsx"
        ref={fileInput}
        onChange={handleFileChange}
        className="mb-4"
      />
  <ErrorFeedback error={error} onRetry={() => setError(null)} />
      <ul>
        {recipients.map((name, idx) => (
          <li key={idx} className="border px-2 py-1 rounded mb-1">{name}</li>
        ))}
      </ul>
    </div>
  );
}
