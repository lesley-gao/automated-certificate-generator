import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Download,
  FileArchive,
  CheckCircle,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useRecipients } from "../../context/RecipientsContext";
import { useDesign } from "../../context/DesignContext";
import { generateZipWithCertificates } from "../../api/backend";

export default function DownloadLink({
  url,
  label,
}: {
  url: string;
  label?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { recipients } = useRecipients();
  const { designSettings } = useDesign();

  const generatePreview = () => {
    if (recipients.length === 0) return null;

    const sampleRecipient = recipients[0];
    const canvasWidth = designSettings.canvasWidth || 800;
    const canvasHeight = designSettings.canvasHeight || 600;

    return (
      <div
        className="relative border-2 border-gray-300 bg-white"
        style={{
          width: Math.min(canvasWidth, 400),
          aspectRatio: "1.414/1", // A4 landscape ratio (297mm x 210mm)
          backgroundImage: designSettings.backgroundImage
            ? `url(${designSettings.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {designSettings.textFields.map((textField, index) => {
          let text = textField.text;
          if (sampleRecipient.name) {
            text = text.replace(/\{name\}/g, sampleRecipient.name);
            text = text.replace(/\{recipient\}/g, sampleRecipient.name);
          }
          if (sampleRecipient.email) {
            text = text.replace(/\{email\}/g, sampleRecipient.email);
          }
          text = text.replace(/\{date\}/g, new Date().toLocaleDateString());

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: (textField.x / canvasWidth) * Math.min(canvasWidth, 400),
                top: (textField.y / canvasHeight) * Math.min(canvasHeight, 300),
                color: textField.color || "#000000",
                fontSize: Math.max((textField.fontSize || 24) * 0.5, 8),
                fontFamily: textField.fontFamily || "Arial",
                lineHeight: 1.2,
                maxWidth: "90%",
                wordWrap: "break-word",
              }}
            >
              {text}
            </div>
          );
        })}

        {designSettings.imageFields.map((imageField, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: (imageField.x / canvasWidth) * Math.min(canvasWidth, 400),
              top: (imageField.y / canvasHeight) * Math.min(canvasHeight, 300),
              width: Math.min((imageField.width || 100) * 0.5, 50),
              height: Math.min((imageField.height || 100) * 0.5, 50),
            }}
          >
            <img
              src={imageField.url}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    );
  };

  const handleGenerateCertificates = async () => {
    if (recipients.length === 0) {
      setError(
        "No recipients found. Please add recipients in the previous steps."
      );
      return;
    }

    if (
      designSettings.textFields.length === 0 &&
      designSettings.imageFields.length === 0
    ) {
      setError(
        "No design elements found. Please add text fields or images in the design step."
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("🚀 Starting certificate generation...");
      console.log("📋 Recipients:", recipients);

      // Call the real backend API to generate certificates
      const zipBlob = await generateZipWithCertificates({
        recipients,
        designSettings,
        backgroundImage: designSettings.backgroundImage,
      });

      console.log("📦 ZIP file generated successfully!");

      // Create download link for the ZIP file
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `certificates_${
        new Date().toISOString().split("T")[0]
      }.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      console.log("✅ Certificates downloaded successfully!");
      setIsReady(true);
    } catch (err) {
      console.error("❌ Certificate generation failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate certificates. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="h-6 w-6" />
            {isReady ? "Certificates Ready!" : "Generate Certificates"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <>
            {!isReady && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <FileArchive className="h-5 w-5" />
                  <span>
                    Ready to generate certificates for {recipients.length}{" "}
                    recipients
                  </span>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Certificate Preview */}
                {designSettings.textFields.length > 0 ||
                designSettings.imageFields.length > 0 ? (
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">
                        Certificate Preview
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        {showPreview ? "Hide" : "Show"} Preview
                      </Button>
                    </div>

                    {showPreview && (
                      <div className="flex justify-center mb-4">
                        {generatePreview()}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mb-3">
                      Click the button below to generate and download
                      certificates
                    </p>

                    <Button
                      onClick={handleGenerateCertificates}
                      disabled={isGenerating || recipients.length === 0}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" />
                          Generate & Download Certificates
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-muted-foreground mb-3">
                      Click the button below to generate and download
                      certificates
                    </p>

                    <Button
                      onClick={handleGenerateCertificates}
                      disabled={isGenerating || recipients.length === 0}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" />
                          Generate & Download Certificates
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isReady && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Certificates generated successfully!
                  </span>
                </div>

                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground mb-3">
                    Your certificates have been downloaded
                  </p>
                  <Button
                    onClick={() => setIsReady(false)}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    Generate New Certificates
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>
                • Generates actual PNG certificate images for each recipient
              </p>
              <p>• Certificates are packaged in a ZIP file for easy download</p>
              <p>
                • Each certificate includes recipient name, date, and unique ID
              </p>
              <p>• High-quality A4 format certificates ready for printing</p>
            </div>
          </>
        </CardContent>
      </Card>
    </div>
  );
}
