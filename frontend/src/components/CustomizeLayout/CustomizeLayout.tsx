import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { 
  Users, 
  Type, 
  Move, 
  RotateCcw, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useDesign } from '../../context/DesignContext';
import { useRecipients } from '../../context/RecipientsContext';

export default function CustomizeLayout() {
  const { 
    designSettings, 
    updateTextFieldForRecipient, 
    getTextFieldForRecipient,
    updateTemplateField,
    clearRecipientOverrides,
    hasRecipientOverride
  } = useDesign();
  const { recipients } = useRecipients();
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<{ fieldId: number; recipientId: number } | null>(null);
  const [isTemplateMode, setIsTemplateMode] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedRecipient = recipients[selectedRecipientIndex];
  const nameFields = designSettings.textFields.filter(field => field.text.includes('{name}'));

  const handleMouseDown = (e: React.MouseEvent, fieldId: number) => {
    e.preventDefault();
    setIsDragging(true);
    
    // In template mode, use the first recipient as the template
    const templateRecipientId = isTemplateMode ? recipients[0]?.id : selectedRecipient.id;
    setDragElement({ fieldId, recipientId: templateRecipientId });
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    const field = getTextFieldForRecipient(dragElement.fieldId, dragElement.recipientId);
    const newX = Math.max(0, Math.min(designSettings.canvasWidth - 100, field.x + deltaX));
    const newY = Math.max(0, Math.min(designSettings.canvasHeight - 30, field.y + deltaY));

    if (isTemplateMode) {
      // Update template field (affects all certificates)
      updateTemplateField(dragElement.fieldId, {
        x: newX,
        y: newY,
      });
    } else {
      // Update individual recipient field
      updateTextFieldForRecipient(dragElement.fieldId, dragElement.recipientId, {
        x: newX,
        y: newY,
      });
    }

    setDragStart({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragElement(null);
  };

  const resetPosition = (fieldId: number) => {
    if (isTemplateMode) {
      // Clear all overrides for this field
      clearRecipientOverrides(fieldId);
    } else {
      // Clear override for current recipient
      clearRecipientOverrides(fieldId, selectedRecipient.id);
    }
  };

  const updateFontSize = (fieldId: number, fontSize: number) => {
    if (isTemplateMode) {
      updateTemplateField(fieldId, { fontSize });
    } else {
      updateTextFieldForRecipient(fieldId, selectedRecipient.id, { fontSize });
    }
  };

  if (recipients.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Recipients Found</h3>
            <p className="text-muted-foreground">
              Please add recipients in the previous step before customizing layouts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (nameFields.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Type className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Name Fields Found</h3>
            <p className="text-muted-foreground mb-4">
              Name fields are automatically created when you add recipients. Please add recipients first.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">How to get started:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Go back to the "Add Recipients" step</li>
                <li>2. Add recipients manually or import from CSV</li>
                <li>3. A name field will be automatically created</li>
                <li>4. Return to this step to customize positioning</li>
              </ol>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              The name field will be positioned in the center of the certificate by default.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Customize Layout for Each Recipient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isTemplateMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsTemplateMode(true)}
              >
                Template Mode
              </Button>
              <Button
                variant={!isTemplateMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsTemplateMode(false)}
              >
                Individual Mode
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecipientIndex(Math.max(0, selectedRecipientIndex - 1))}
                  disabled={selectedRecipientIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="font-medium">{selectedRecipient.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedRecipientIndex + 1} of {recipients.length}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecipientIndex(Math.min(recipients.length - 1, selectedRecipientIndex + 1))}
                  disabled={selectedRecipientIndex === recipients.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {isTemplateMode ? "Template mode - changes affect all certificates" : "Individual mode - drag text to adjust position"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certificate Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={canvasRef}
                className="relative border-2 border-gray-300 bg-white mx-auto"
                style={{
                  width: Math.min(designSettings.canvasWidth, 600),
                  aspectRatio: '1.414/1', // A4 landscape
                  backgroundImage: designSettings.backgroundImage ? `url(${designSettings.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: designSettings.backgroundImage ? 'transparent' : 'hsl(var(--muted) / 0.2)',
                  userSelect: isDragging ? 'none' : 'auto',
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Render all text fields */}
                {designSettings.textFields.map((field) => {
                  const fieldForRecipient = getTextFieldForRecipient(field.id, selectedRecipient.id);
                  let displayText = fieldForRecipient.text;
                  
                  // Replace placeholders
                  if (selectedRecipient.name) {
                    displayText = displayText.replace(/\{name\}/g, selectedRecipient.name);
                  }
                  if (selectedRecipient.email) {
                    displayText = displayText.replace(/\{email\}/g, selectedRecipient.email);
                  }
                  displayText = displayText.replace(/\{date\}/g, new Date().toLocaleDateString());

                  const isNameField = field.text.includes('{name}');
                  
                  return (
                    <div
                      key={field.id}
                      className={`absolute select-none ${
                        isNameField ? 'cursor-grab active:cursor-grabbing' : ''
                      } ${isDragging && dragElement?.fieldId === field.id ? 'z-10' : 'z-5'}`}
                      style={{
                        left: fieldForRecipient.x,
                        top: fieldForRecipient.y,
                        fontSize: fieldForRecipient.fontSize || 16,
                        fontFamily: fieldForRecipient.fontFamily || 'Arial, sans-serif',
                        color: fieldForRecipient.color || '#000000',
                        fontWeight: isNameField ? 'bold' : 'normal',
                        textShadow: isNameField ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
                        border: isNameField ? '2px dashed rgba(59, 130, 246, 0.5)' : 'none',
                        borderRadius: isNameField ? '4px' : '0',
                        padding: isNameField ? '2px 4px' : '0',
                        backgroundColor: isNameField ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      }}
                      onMouseDown={isNameField ? (e) => handleMouseDown(e, field.id) : undefined}
                    >
                      {displayText}
                    </div>
                  );
                })}

                {/* Render image fields */}
                {designSettings.imageFields.map((field) => (
                  <img
                    key={field.id}
                    src={field.url}
                    alt="Certificate element"
                    className="absolute"
                    style={{
                      left: field.x,
                      top: field.y,
                      width: field.width || 100,
                      height: field.height || 100,
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Adjustments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nameFields.map((field) => {
                const fieldForRecipient = getTextFieldForRecipient(field.id, selectedRecipient.id);
                const hasOverrides = field.recipientOverrides?.[selectedRecipient.id];
                const hasAnyOverrides = Object.keys(field.recipientOverrides || {}).length > 0;
                
                return (
                  <div key={field.id} className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Name Field</span>
                        {hasAnyOverrides && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {Object.keys(field.recipientOverrides || {}).length} custom
                          </span>
                        )}
                      </div>
                      {(hasOverrides || (isTemplateMode && hasAnyOverrides)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetPosition(field.id)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          {isTemplateMode ? "Clear All" : "Reset"}
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Font Size</label>
                        <Input
                          type="number"
                          value={fieldForRecipient.fontSize || 16}
                          onChange={(e) => updateFontSize(field.id, parseInt(e.target.value) || 16)}
                          min="8"
                          max="72"
                          className="h-8"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">X Position</label>
                          <Input
                            type="number"
                            value={Math.round(fieldForRecipient.x)}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (isTemplateMode) {
                                updateTemplateField(field.id, { x: value });
                              } else {
                                updateTextFieldForRecipient(field.id, selectedRecipient.id, { x: value });
                              }
                            }}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Y Position</label>
                          <Input
                            type="number"
                            value={Math.round(fieldForRecipient.y)}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (isTemplateMode) {
                                updateTemplateField(field.id, { y: value });
                              } else {
                                updateTextFieldForRecipient(field.id, selectedRecipient.id, { y: value });
                              }
                            }}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <Move className="h-4 w-4 mx-auto mb-2" />
                <p>
                  {isTemplateMode 
                    ? "Template Mode: Changes affect all certificates. Use Individual Mode to customize specific recipients."
                    : "Individual Mode: Drag the blue highlighted name field to adjust position for this recipient only."
                  }
                </p>
                <p className="mt-1">Use the controls to fine-tune positioning and font size.</p>
                {!isTemplateMode && (
                  <p className="mt-1 text-xs text-orange-600">
                    💡 Switch to Template Mode to make changes that affect all certificates
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
