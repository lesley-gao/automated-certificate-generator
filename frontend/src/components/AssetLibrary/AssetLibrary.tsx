import React, { useRef, useState } from 'react';
import ErrorFeedback from '../ErrorFeedback';

interface Asset {
  id: number;
  name: string;
  url: string;
}

export default function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAssets([...assets, {
        id: Date.now(),
        name: file.name,
        url: reader.result as string,
      }]);
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Asset Library</h2>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
        className="mb-4"
      />
  <ErrorFeedback error={error} onRetry={() => setError(null)} />
      <div className="grid grid-cols-2 gap-2">
        {assets.map(asset => (
          <div key={asset.id} className="border rounded p-2 flex flex-col items-center">
            <img src={asset.url} alt={asset.name} className="max-w-xs max-h-32 mb-2 rounded shadow" />
            <span className="text-xs text-gray-700">{asset.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
