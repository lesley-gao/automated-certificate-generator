import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Download,
  FileArchive,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRecipients } from "../../context/RecipientsContext";
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
  const { recipients } = useRecipients();

  const handleGenerateCertificates = async () => {
    if (recipients.length === 0) {
      setError(
        "No recipients found. Please add recipients in the previous steps."
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
        designSettings: {
          backgroundImage: "default_background.png",
          textFields: ["Recipient Name", "Certificate Title", "Date"],
          signatures: ["authority_signature.png"],
        },
        backgroundImage: "default_background.png",
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

              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-muted-foreground mb-3">
                  Click the button below to generate and download certificates
                </p>
                <Button
                  onClick={handleGenerateCertificates}
                  disabled={isGenerating || recipients.length === 0}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
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
            <p>• Generates actual PNG certificate images for each recipient</p>
            <p>• Certificates are packaged in a ZIP file for easy download</p>
            <p>
              • Each certificate includes recipient name, date, and unique ID
            </p>
            <p>• High-quality A4 format certificates ready for printing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
