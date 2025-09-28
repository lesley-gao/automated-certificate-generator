import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Type, Image, Move, Trash2 } from 'lucide-react';
import SignatureUpload from './SignatureUpload';
import { useDesign } from '../../context/DesignContext';

export default function Designer() {
  const {
    designSettings,
    addTextField,
    updateTextField,
    removeTextField,
    addImageField,
    updateImageField,
    removeImageField,
  } = useDesign();
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newText, setNewText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<{ id: number; type: 'text' | 'image'; startX: number; startY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  function addField() {
    if (!newText.trim()) return;
    addTextField({ x: 50, y: 50, text: newText });
    setNewText('');
  }

  function addImage(url: string) {
    addImageField({ x: 100, y: 100, url });
  }

  function editField(id: number, text: string) {
    updateTextField(id, { text });
  }

  function deleteField(id: number) {
    removeTextField(id);
    removeImageField(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function handleMouseDown(e: React.MouseEvent, id: number, type: 'text' | 'image', currentX: number, currentY: number) {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedId(id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragElement({ id, type, startX: currentX, startY: currentY });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !dragElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = Math.max(0, Math.min(canvasRect.width - 100, dragElement.startX + deltaX));
    const newY = Math.max(0, Math.min(canvasRect.height - 50, dragElement.startY + deltaY));

    if (dragElement.type === 'text') {
      updateTextField(dragElement.id, { x: newX, y: newY });
    } else {
      updateImageField(dragElement.id, { x: newX, y: newY });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    setDragElement(null);
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Move className="h-5 w-5" />
              Design Canvas
            </div>
            {designSettings.backgroundImage && (
              <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                <Image className="h-4 w-4" />
                Background loaded
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={canvasRef}
            className={`relative w-full border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              userSelect: isDragging ? 'none' : 'auto',
              aspectRatio: '1.414/1', // A4 landscape ratio (297mm x 210mm)
              backgroundImage: designSettings.backgroundImage ? `url(${designSettings.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: designSettings.backgroundImage ? 'transparent' : 'hsl(var(--muted) / 0.2)'
            }}
          >
            {designSettings.textFields.length === 0 && designSettings.imageFields.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                  <Type className="h-12 w-12 mx-auto mb-2 opacity-50 text-gray-600" />
                  <p className="text-gray-600 font-medium">Add text fields and images to start designing</p>
                  <p className="text-sm text-gray-500 mt-2">💡 Tip: Name fields are automatically created when you add recipients</p>
                  {designSettings.backgroundImage && (
                    <p className="text-sm text-gray-500 mt-2">Background image loaded ✓</p>
                  )}
                </div>
              </div>
            )}
            
            {designSettings.textFields.map(field => (
              <div
                key={field.id}
                className={`absolute px-3 py-2 bg-primary/10 border-2 rounded-lg transition-all select-none ${
                  isDragging && dragElement?.id === field.id ? 'cursor-grabbing z-10' : 'cursor-grab'
                } ${selectedId === field.id ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'}`}
                style={{ left: field.x, top: field.y }}
                onMouseDown={(e) => handleMouseDown(e, field.id, 'text', field.x, field.y)}
              >
                <input
                  type="text"
                  value={field.text}
                  onChange={e => editField(field.id, e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium min-w-32"
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                />
                {selectedId === field.id && (
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="destructive" className="h-6 w-6 p-0" onClick={() => deleteField(field.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {designSettings.imageFields.map(img => (
              <div
                key={img.id}
                className={`absolute transition-all select-none ${
                  isDragging && dragElement?.id === img.id ? 'cursor-grabbing z-10' : 'cursor-grab'
                } ${selectedId === img.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                style={{ left: img.x, top: img.y }}
                onMouseDown={(e) => handleMouseDown(e, img.id, 'image', img.x, img.y)}
              >
                <img
                  src={img.url}
                  alt="Signature/Image"
                  className="max-w-[100px] max-h-[100px] rounded shadow"
                />
                {selectedId === img.id && (
                  <div className="flex gap-1 mt-2">
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
            <p>• Click and drag elements to reposition them</p>
            <p>• Elements are constrained within the canvas boundaries</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
