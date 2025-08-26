import React, { useState } from 'react';

interface TextField {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface ImageField {
  id: number;
  x: number;
  y: number;
  url: string;
}

export default function Designer() {
  const [fields, setFields] = useState<TextField[]>([]);
  const [images, setImages] = useState<ImageField[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newText, setNewText] = useState('');

  function addField() {
    setFields([...fields, { id: Date.now(), x: 50, y: 50, text: newText }]);
    setNewText('');
  }

  function addImage(url: string) {
    setImages([...images, { id: Date.now(), x: 100, y: 100, url }]);
  }

  function moveField(id: number, dx: number, dy: number) {
    setFields(fields.map(f => f.id === id ? { ...f, x: f.x + dx, y: f.y + dy } : f));
    setImages(images.map(img => img.id === id ? { ...img, x: img.x + dx, y: img.y + dy } : img));
  }

  function editField(id: number, text: string) {
    setFields(fields.map(f => f.id === id ? { ...f, text } : f));
  }

  function deleteField(id: number) {
    setFields(fields.filter(f => f.id !== id));
    setImages(images.filter(img => img.id !== id));
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Drag-and-Drop Designer</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Text to add"
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addField}
          disabled={!newText}
        >Add Text Field</button>
      </div>
      <div className="mb-4">
        {/* Signature/Image upload */}
        <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(require('./SignatureUpload').default, {
            onUpload: addImage,
          })}
        </React.Suspense>
      </div>
      <div className="relative w-full h-64 border bg-gray-100 rounded">
        {fields.map(field => (
          <div
            key={field.id}
            className={`absolute px-2 py-1 bg-yellow-100 rounded cursor-move ${selectedId === field.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ left: field.x, top: field.y }}
            onClick={() => setSelectedId(field.id)}
          >
            <input
              type="text"
              value={field.text}
              onChange={e => editField(field.id, e.target.value)}
              className="bg-transparent border-none outline-none w-32"
            />
            <div className="flex gap-1 mt-1">
              <button className="text-xs px-1 bg-gray-200 rounded" onClick={() => moveField(field.id, -10, 0)}>&larr;</button>
              <button className="text-xs px-1 bg-gray-200 rounded" onClick={() => moveField(field.id, 10, 0)}>&rarr;</button>
              <button className="text-xs px-1 bg-gray-200 rounded" onClick={() => moveField(field.id, 0, -10)}>&uarr;</button>
              <button className="text-xs px-1 bg-gray-200 rounded" onClick={() => moveField(field.id, 0, 10)}>&darr;</button>
              <button className="text-xs px-1 bg-red-200 text-red-700 rounded" onClick={() => deleteField(field.id)}>Delete</button>
            </div>
          </div>
        ))}
        {images.map(img => (
          <img
            key={img.id}
            src={img.url}
            alt="Signature/Image"
            className={`absolute max-w-[80px] max-h-[80px] rounded shadow ${selectedId === img.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ left: img.x, top: img.y }}
            onClick={() => setSelectedId(img.id)}
          />
        ))}
      </div>
    </div>
  );
}
