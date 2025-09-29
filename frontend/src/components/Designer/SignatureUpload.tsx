import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Upload, Image, AlertCircle, CheckCircle, Trash2, Plus } from 'lucide-react';

interface Signature {
  id: number;
  url: string;
  name: string;
}

export default function SignatureUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
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
      const newSignature: Signature = {
        id: Date.now(),
        url: reader.result as string,
        name: file.name
      };
      
      setSignatures(prev => [...prev, newSignature]);
      onUpload(reader.result as string);
      setIsUploading(false);
      
      // Clear the input so the same file can be selected again
      if (fileInput.current) {
        fileInput.current.value = '';
      }
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

  function deleteSignature(id: number) {
    setSignatures(prev => prev.filter(sig => sig.id !== id));
  }

  return (
    <div className="w-full space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Image className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            
            <p className="text-sm text-muted-foreground mb-3">
              Can add multiple signatures or logos to your certificate
            </p>
          </div>
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Signatures/Logos'}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Signatures List */}
      {signatures.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm text-muted-foreground">
            Uploaded Signatures ({signatures.length})
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {signatures.map((signature) => (
              <div key={signature.id} className="relative group">
                <div className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <img 
                      src={signature.url} 
                      alt={signature.name}
                      className="max-w-20 max-h-16 rounded border object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center truncate" title={signature.name}>
                    {signature.name}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteSignature(signature.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
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
  );
}
