export async function uploadAsset(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/assets/upload', {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function generateCertificate(data: any) {
  const res = await fetch('/api/certificates/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function generateZipWithCertificates(data: {
  recipients: Array<{ name: string; email?: string }>;
  designSettings?: any;
  backgroundImage?: string;
}) {
  const res = await fetch('/api/certificates/generate-zip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to generate certificates');
  }
  
  // Return the blob for download
  return res.blob();
}

export async function batchDownload() {
  const res = await fetch('/api/certificates/batch-download');
  return res.json();
}
