import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Upload, Image, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignatureUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setIsUploading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setIsUploading(false);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG, etc.).');
      setIsUploading(false);
      return;
    }

    // Check file size (max 5MB for signatures)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onUpload(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleUploadClick() {
    fileInput.current?.click();
  }

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors">
        <div className="text-center space-y-3">
          {!preview ? (
            <>
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Image className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Upload Signature/Logo</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a signature or logo to your certificate
                </p>
              </div>
              <Button 
                onClick={handleUploadClick}
                disabled={isUploading}
                variant="outline"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Signature uploaded!</span>
              </div>
              <div className="relative inline-block">
                <img 
                  src={preview} 
                  alt="Signature Preview" 
                  className="max-w-32 max-h-20 rounded border"
                />
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Signature
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
