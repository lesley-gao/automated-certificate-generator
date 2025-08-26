import React from 'react';

const builtInDesigns = [
  { id: 1, name: 'Classic', preview: '/images/classic.png' },
  { id: 2, name: 'Modern', preview: '/images/modern.png' },
  { id: 3, name: 'Elegant', preview: '/images/elegant.png' },
];

export default function DesignGallery({ onSelect }: { onSelect?: (id: number) => void }) {
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Design Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {builtInDesigns.map(design => (
          <div key={design.id} className="border rounded p-2 flex flex-col items-center">
            <img src={design.preview} alt={design.name} className="max-w-xs max-h-32 mb-2 rounded shadow" />
            <span className="text-xs text-gray-700 mb-2">{design.name}</span>
            {onSelect && (
              <button className="bg-blue-200 text-blue-700 px-2 py-1 rounded" onClick={() => onSelect(design.id)}>
                Select
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
