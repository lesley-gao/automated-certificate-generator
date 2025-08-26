import React from 'react';

export default function DownloadLink({ url, label }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      download
      className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
    >
      {label || 'Download'}
    </a>
  );
}
