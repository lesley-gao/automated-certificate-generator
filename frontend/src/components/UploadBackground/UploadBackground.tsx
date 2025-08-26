import React, { useRef, useState } from 'react';

export default function UploadBackground() {
  const [preview, setPreview] = useState<string | null>(null);
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
    reader.onload = () => setPreview(reader.result as string);
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
        className="mb-4"
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {preview ? (
        <img src={preview} alt="Background Preview" className="max-w-xs rounded shadow" />
      ) : (
        <div className="text-gray-400">No background uploaded yet.</div>
      )}
    </div>
  );
}
