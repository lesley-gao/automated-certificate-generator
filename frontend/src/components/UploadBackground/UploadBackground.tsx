import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Upload, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { useDesign } from '../../context/DesignContext';

export default function UploadBackground() {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { designSettings, setBackgroundImage } = useDesign();

  // Initialize preview with existing background image
  React.useEffect(() => {
    if (designSettings.backgroundImage && !preview) {
      setPreview(designSettings.backgroundImage);
    }
  }, [designSettings.backgroundImage, preview]);

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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBackgroundImage(result); // Store in DesignContext
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

  function handleRemoveBackground() {
    setPreview(null);
    setBackgroundImage('');
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            {!preview ? (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Certificate Background</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose an image file to use as your certificate background. 
                    Supported formats: PNG, JPG, JPEG (max 10MB)
                  </p>
                </div>
                <Button 
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="px-8"
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Background uploaded successfully!</span>
                </div>
                <div className="relative inline-block">
                  <img 
                    src={preview} 
                    alt="Background Preview" 
                    className="max-w-full max-h-64 rounded-lg shadow-lg border"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline"
                    onClick={handleUploadClick}
                    className="px-6"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Background
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleRemoveBackground}
                    className="px-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove Background
                  </Button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
