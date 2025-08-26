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

export async function batchDownload() {
  const res = await fetch('/api/certificates/batch-download');
  return res.json();
}
