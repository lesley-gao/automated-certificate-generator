import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Type,
  Image,
  Move,
  Trash2,
  Palette,
  Type as FontIcon,
} from "lucide-react";
import SignatureUpload from "./SignatureUpload";
import { useDesign } from "../../context/DesignContext";

export default function Designer() {
  const {
    designSettings,
    updateDesignSettings,
    addTextField,
    updateTextField,
    removeTextField,
    addImageField,
    updateImageField,
    removeImageField,
  } = useDesign();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<{
    id: number;
    type: "text" | "image";
    startX: number;
    startY: number;
  } | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  function addField() {
    if (!newText.trim()) return;
    addTextField({
      x: 50,
      y: 50,
      text: newText,
      fontSize: 16,
      fontFamily: "Arial",
      color: "#000000",
    });
    setNewText("");
  }

  function addImage(url: string) {
    addImageField({ x: 100, y: 100, url });
  }

  function applyTemplate(templateName: string, templateElements: any[]) {
    // Create new text fields with unique IDs
    const newTextFields = templateElements.map((element) => ({
      id: Date.now() + Math.random(), // Ensure unique IDs
      ...element,
    }));

    // Set all text fields at once, replacing any existing ones
    updateDesignSettings({ textFields: newTextFields });

    // Set current template
    setCurrentTemplate(templateName);
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

  function handleMouseDown(
    e: React.MouseEvent,
    id: number,
    type: "text" | "image",
    currentX: number,
    currentY: number
  ) {
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

    const newX = Math.max(
      0,
      Math.min(canvasRect.width - 100, dragElement.startX + deltaX)
    );
    const newY = Math.max(
      0,
      Math.min(canvasRect.height - 50, dragElement.startY + deltaY)
    );

    if (dragElement.type === "text") {
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
            Certificate Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Certificate Templates */}
          <div className="pt-4">
            {currentTemplate && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">
                      <strong>Current Template:</strong> {currentTemplate}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      You can customize the elements above, but only one
                      template can be used at a time.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateDesignSettings({ textFields: [] });
                      setCurrentTemplate(null);
                    }}
                    className="ml-2 text-xs"
                  >
                    Clear Template
                  </Button>
                </div>
              </div>
            )}

            <div className="grid w-full gap-3 grid-cols-1 lg:grid-cols-4">
              {/* Appreciation Certificate Template */}
              <div className="border rounded-lg p-3 transition-colors bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:from-amber-100 hover:to-orange-100 w-full">
                <h5 className="font-medium text-base mb-2">
                  Certificate of Appreciation
                </h5>
                <p className="text-[14px] text-muted-foreground mb-3">
                  Perfect for recognizing volunteers, contributors, and
                  supporters
                </p>
                <Button
                  variant={
                    currentTemplate === "Certificate of Appreciation"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const templateElements = [
                      {
                        x: designSettings.canvasWidth / 2 - 150,
                        y: 80,
                        text: "CERTIFICATE OF APPRECIATION",
                        fontSize: 28,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 50,
                        y: 140,
                        text: "Is awarded to",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 200,
                        y: 280,
                        text: "Thank you for your outstanding contribution and dedication. Your efforts have made a significant impact and are greatly appreciated.",
                        fontSize: 14,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: 150,
                        y: designSettings.canvasHeight - 120,
                        text: "Director Name",
                        fontSize: 12,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth - 200,
                        y: designSettings.canvasHeight - 120,
                        text: "Chair Name",
                        fontSize: 12,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                    ];
                    applyTemplate(
                      "Certificate of Appreciation",
                      templateElements
                    );
                  }}
                  className="w-full"
                >
                  {currentTemplate === "Certificate of Appreciation"
                    ? "✓ Applied"
                    : "Use This Template"}
                </Button>
              </div>

              {/* Completion Certificate Template */}
              <div className="border rounded-lg p-3 transition-colors bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100 w-full">
                <h5 className="font-medium text-base mb-2">
                  Certificate of Completion
                </h5>
                <p className="text-[14px] text-muted-foreground mb-3">
                  Ideal for courses, training programs, and workshops
                </p>
                <Button
                  variant={
                    currentTemplate === "Certificate of Completion"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const templateElements = [
                      {
                        x: designSettings.canvasWidth / 2 - 120,
                        y: 80,
                        text: "CERTIFICATE OF COMPLETION",
                        fontSize: 28,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 80,
                        y: 140,
                        text: "This certifies that",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 150,
                        y: 220,
                        text: "has successfully completed the course",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 100,
                        y: 280,
                        text: "Course Name",
                        fontSize: 18,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 80,
                        y: 320,
                        text: "Date: {date}",
                        fontSize: 14,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 100,
                        y: designSettings.canvasHeight - 100,
                        text: "Instructor Name",
                        fontSize: 12,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                    ];
                    applyTemplate(
                      "Certificate of Completion",
                      templateElements
                    );
                  }}
                  className="w-full"
                >
                  {currentTemplate === "Certificate of Completion"
                    ? "✓ Applied"
                    : "Use This Template"}
                </Button>
              </div>

              {/* Achievement Certificate Template */}
              <div className="border rounded-lg p-3 transition-colors bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 w-full">
                <h5 className="font-medium text-base mb-2">
                  Certificate of Achievement
                </h5>
                <p className="text-[14px] text-muted-foreground mb-3">
                  Great for awards, competitions, and outstanding performance
                </p>
                <Button
                  variant={
                    currentTemplate === "Certificate of Achievement"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const templateElements = [
                      {
                        x: designSettings.canvasWidth / 2 - 120,
                        y: 80,
                        text: "CERTIFICATE OF ACHIEVEMENT",
                        fontSize: 28,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 100,
                        y: 140,
                        text: "is hereby recognized for",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 150,
                        y: 200,
                        text: "Outstanding Achievement",
                        fontSize: 20,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 200,
                        y: 260,
                        text: "For demonstrating excellence and dedication in their field of work.",
                        fontSize: 14,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 60,
                        y: 320,
                        text: "Awarded on {date}",
                        fontSize: 14,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: 150,
                        y: designSettings.canvasHeight - 100,
                        text: "Awarding Authority",
                        fontSize: 12,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                    ];
                    applyTemplate(
                      "Certificate of Achievement",
                      templateElements
                    );
                  }}
                  className="w-full"
                >
                  {currentTemplate === "Certificate of Achievement"
                    ? "✓ Applied"
                    : "Use This Template"}
                </Button>
              </div>

              {/* Participation Certificate Template */}
              <div className="border rounded-lg p-3 transition-colors bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100 w-full">
                <h5 className="font-medium text-base mb-2">
                  Certificate of Participation
                </h5>
                <p className="text-[14px] text-muted-foreground mb-3">
                  Perfect for events, conferences, and general participation
                </p>
                <Button
                  variant={
                    currentTemplate === "Certificate of Participation"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const templateElements = [
                      {
                        x: designSettings.canvasWidth / 2 - 140,
                        y: 80,
                        text: "CERTIFICATE OF PARTICIPATION",
                        fontSize: 28,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 80,
                        y: 140,
                        text: "This is to certify that",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 100,
                        y: 200,
                        text: "has participated in",
                        fontSize: 16,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 120,
                        y: 260,
                        text: "Event Name",
                        fontSize: 18,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 100,
                        y: 300,
                        text: "Held on {date}",
                        fontSize: 14,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                      {
                        x: designSettings.canvasWidth / 2 - 120,
                        y: designSettings.canvasHeight - 100,
                        text: "Event Organizer",
                        fontSize: 12,
                        fontFamily: "Arial",
                        color: "#000000",
                      },
                    ];
                    applyTemplate(
                      "Certificate of Participation",
                      templateElements
                    );
                  }}
                  className="w-full"
                >
                  {currentTemplate === "Certificate of Participation"
                    ? "✓ Applied"
                    : "Use This Template"}
                </Button>
              </div>
            </div>
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
              <div className="flex items-center gap-1 text-base text-green-600 bg-green-50 px-2 py-1 rounded">
                <Image className="h-4 w-4" />
                Background loaded
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Font Controls for Selected Text Field */}
          {selectedId &&
            designSettings.textFields.find((f) => f.id === selectedId) && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <FontIcon className="h-4 w-4" />
                  <h4 className="font-medium text-base">Text Field Properties</h4>
                </div>

                {(() => {
                  const selectedField = designSettings.textFields.find(
                    (f) => f.id === selectedId
                  );
                  if (!selectedField) return null;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                      {/* Text Content */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Text Content
                        </label>
                        <Input
                          type="text"
                          value={selectedField.text}
                          onChange={(e) =>
                            updateTextField(selectedField.id, {
                              text: e.target.value,
                            })
                          }
                          className="text-base"
                        />
                      </div>

                      {/* Font Family */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Font Family
                        </label>
                        <select
                          value={selectedField.fontFamily || "Arial"}
                          onChange={(e) =>
                            updateTextField(selectedField.id, {
                              fontFamily: e.target.value,
                            })
                          }
                          className="w-full text-base bg-background border border-input rounded-md px-3 py-2"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Courier New">Courier New</option>
                          <option value="serif">Serif</option>
                          <option value="sans-serif">Sans-serif</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Font Size
                        </label>
                        <select
                          value={selectedField.fontSize || 16}
                          onChange={(e) =>
                            updateTextField(selectedField.id, {
                              fontSize: parseInt(e.target.value),
                            })
                          }
                          className="w-full text-base bg-background border border-input rounded-md px-3 py-2"
                        >
                          <option value="8">8px</option>
                          <option value="10">10px</option>
                          <option value="12">12px</option>
                          <option value="14">14px</option>
                          <option value="16">16px</option>
                          <option value="18">18px</option>
                          <option value="20">20px</option>
                          <option value="24">24px</option>
                          <option value="28">28px</option>
                          <option value="32">32px</option>
                          <option value="36">36px</option>
                          <option value="48">48px</option>
                          <option value="64">64px</option>
                        </select>
                      </div>

                      {/* Width */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Width (px) - Optional
                        </label>
                        <Input
                          type="number"
                          value={selectedField.width || ""}
                          onChange={(e) =>
                            updateTextField(selectedField.id, {
                              width: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="text-base"
                          placeholder="Auto"
                          min="1"
                        />
                      </div>

                      {/* Height */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Height (px) - Optional
                        </label>
                        <Input
                          type="number"
                          value={selectedField.height || ""}
                          onChange={(e) =>
                            updateTextField(selectedField.id, {
                              height: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="text-base"
                          placeholder="Auto"
                          min="1"
                        />
                      </div>

                      {/* Text Color & Delete */}
                      <div className="flex flex-col gap-2">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Text Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedField.color || "#000000"}
                              onChange={(e) =>
                                updateTextField(selectedField.id, {
                                  color: e.target.value,
                                })
                              }
                              className="w-8 h-8 border border-input rounded-md cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={selectedField.color || "#000000"}
                              onChange={(e) =>
                                updateTextField(selectedField.id, {
                                  color: e.target.value,
                                })
                              }
                              className="flex-1 text-base font-mono"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteField(selectedField.id)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          <div
            ref={canvasRef}
            className={`relative w-full border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden ${
              isDragging ? "cursor-grabbing" : ""
            }`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              userSelect: isDragging ? "none" : "auto",
              aspectRatio: "1.414/1", // A4 landscape ratio (297mm x 210mm)
              backgroundImage: designSettings.backgroundImage
                ? `url(${designSettings.backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: designSettings.backgroundImage
                ? "transparent"
                : "hsl(var(--muted) / 0.2)",
            }}
          >
            {designSettings.textFields.length === 0 &&
              designSettings.imageFields.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                    <Type className="h-12 w-12 mx-auto mb-2 opacity-50 text-gray-600" />
                    <p className="text-gray-600 font-medium">
                      Add text fields and images to start designing
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      💡 Tip: Name fields are automatically created when you add
                      recipients
                    </p>
                    {designSettings.backgroundImage && (
                      <p className="text-sm text-gray-500 mt-2">
                        Background image loaded ✓
                      </p>
                    )}
                  </div>
                </div>
              )}

            {designSettings.textFields.map((field) => (
              <div
                key={field.id}
                className={`absolute px-3 py-2 bg-primary/10 border-2 rounded-lg transition-all select-none ${
                  isDragging && dragElement?.id === field.id
                    ? "cursor-grabbing z-10"
                    : "cursor-grab"
                } ${
                  selectedId === field.id
                    ? "border-primary shadow-lg"
                    : "border-transparent hover:border-primary/50"
                }`}
                style={{
                  left: field.x,
                  top: field.y,
                  width: field.width ? `${field.width}px` : "fit-content",
                  height: field.height ? `${field.height}px` : "auto",
                  minWidth: "fit-content",
                }}
                onMouseDown={(e) =>
                  handleMouseDown(e, field.id, "text", field.x, field.y)
                }
              >
                <input
                  type="text"
                  value={field.text}
                  onChange={(e) => editField(field.id, e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium"
                  style={{
                    fontSize: `${field.fontSize || 16}px`,
                    fontFamily: field.fontFamily || "Arial",
                    color: field.color || "#000000",
                    width: field.width ? `${field.width}px` : "fit-content",
                    minWidth: "20px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                {selectedId === field.id && (
                  <div className="mt-1 text-xs text-primary font-medium">
                    Selected - Edit in panel above
                  </div>
                )}
              </div>
            ))}

            {designSettings.imageFields.map((img) => (
              <div
                key={img.id}
                className={`absolute transition-all select-none ${
                  isDragging && dragElement?.id === img.id
                    ? "cursor-grabbing z-10"
                    : "cursor-grab"
                } ${
                  selectedId === img.id ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                style={{ left: img.x, top: img.y }}
                onMouseDown={(e) =>
                  handleMouseDown(e, img.id, "image", img.x, img.y)
                }
              >
                <img
                  src={img.url}
                  alt="Signature/Image"
                  className="max-w-[100px] max-h-[100px] rounded"
                />
                {selectedId === img.id && (
                  <div className="flex gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={() => deleteField(img.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h4 className="font-medium text-base mt-4">Add Extra Text</h4>

          <div className="flex pt-2 gap-2">
            <Input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text to add..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && addField()}
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

          <div className="border-t pt-8">
            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1">
                Add Signatures & Logos
              </h4>
            </div>
            <SignatureUpload onUpload={addImage} />
          </div>

          <div className="mt-4 explanation-text text-muted-foreground">
            <p>• Click on elements to select them</p>
            <p>• Click and drag elements to reposition them</p>
            <p>• Use certificate templates to quickly add common elements</p>
            <p>
              • You can add multiple signatures and logos to your certificate
            </p>
            <p>
              • Select text fields to edit font, size, and color above the
              canvas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
