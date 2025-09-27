
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, Upload, CheckCircle, X, Users } from 'lucide-react';
import ErrorFeedback from '../ErrorFeedback';
import { useRecipients } from '../../context/RecipientsContext';

// Simple CSV parser (replace with papaparse/xlsx for production)
function parseCSV(text: string): { name: string }[] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(name => ({ name }));
}

export default function ImportRecipients() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ name: string }[]>([]);
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const fileInput = useRef<HTMLInputElement>(null);
  const { recipients, setRecipients } = useRecipients();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file. (Excel support coming soon)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      try {
        const parsed = parseCSV(text);
        if (parsed.length === 0) throw new Error('No recipients found.');
        setPreview(parsed);
        setStep('preview');
      } catch (err: any) {
        setError('Failed to parse file: ' + err.message);
      }
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(file);
  }

  function handleRemove(idx: number) {
    setPreview(prev => prev.filter((_, i) => i !== idx));
  }

  function handleConfirm() {
    setRecipients(preview);
    setStep('select');
    setPreview([]);
  }

  function handleCancel() {
    setStep('select');
    setPreview([]);
  }

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Recipients from CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'select' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Upload CSV File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a CSV file with recipient names (one per line)
                </p>
                <Button
                  onClick={() => fileInput.current?.click()}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
                <input
                  id="recipients-file"
                  type="file"
                  accept=".csv"
                  ref={fileInput}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-describedby="import-instructions"
                />
              </div>
              <div id="import-instructions" className="text-sm text-muted-foreground">
                <p>• CSV file should have one recipient name per line</p>
                <p>• Excel support coming soon</p>
              </div>
            </div>
          )}
          
          <ErrorFeedback error={error} onRetry={() => setError(null)} />
          
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Preview Recipients ({preview.length})</span>
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                {preview.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                    <span className="flex-1">{r.name}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(idx)}
                      aria-label={`Remove recipient ${r.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirm}
                  disabled={preview.length === 0}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Import ({preview.length} recipients)
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Recipients */}
      {recipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Recipients ({recipients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {recipients.map((r, idx) => (
                <div key={idx} className="p-3 border-b last:border-b-0 hover:bg-muted/50">
                  {r.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
