import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Type, Image, Move, Trash2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import SignatureUpload from './SignatureUpload';

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
    if (!newText.trim()) return;
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
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Design Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Enter text to add..."
              className="flex-1"
              onKeyPress={e => e.key === 'Enter' && addField()}
            />
            <Button
              onClick={addField}
              disabled={!newText.trim()}
              className="px-6"
            >
              <Type className="h-4 w-4 mr-2" />
              Add Text
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <SignatureUpload onUpload={addImage} />
          </div>
        </CardContent>
      </Card>

      {/* Design Canvas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Design Canvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/20 overflow-hidden">
            {fields.length === 0 && images.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add text fields and images to start designing</p>
                </div>
              </div>
            )}
            
            {fields.map(field => (
              <div
                key={field.id}
                className={`absolute px-3 py-2 bg-primary/10 border-2 rounded-lg cursor-move transition-all ${
                  selectedId === field.id ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
                }`}
                style={{ left: field.x, top: field.y }}
                onClick={() => setSelectedId(field.id)}
              >
                <input
                  type="text"
                  value={field.text}
                  onChange={e => editField(field.id, e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium min-w-32"
                  onClick={e => e.stopPropagation()}
                />
                {selectedId === field.id && (
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(field.id, -10, 0)}>
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(field.id, 10, 0)}>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(field.id, 0, -10)}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(field.id, 0, 10)}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" className="h-6 w-6 p-0" onClick={() => deleteField(field.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {images.map(img => (
              <div
                key={img.id}
                className={`absolute cursor-move transition-all ${
                  selectedId === img.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                style={{ left: img.x, top: img.y }}
                onClick={() => setSelectedId(img.id)}
              >
                <img
                  src={img.url}
                  alt="Signature/Image"
                  className="max-w-[100px] max-h-[100px] rounded shadow"
                />
                {selectedId === img.id && (
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(img.id, -10, 0)}>
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(img.id, 10, 0)}>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(img.id, 0, -10)}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => moveField(img.id, 0, 10)}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" className="h-6 w-6 p-0" onClick={() => deleteField(img.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Click on elements to select them</p>
            <p>• Use arrow buttons to move selected elements</p>
            <p>• Click and drag elements to reposition them</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
