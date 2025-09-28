const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

// For now, we'll create a simple HTML-based certificate and convert it to image
// This avoids the canvas compilation issues on Windows

module.exports = {
  generate: async (data) => {
    try {
      const { recipient, designSettings } = data;
      
      // Create HTML certificate content
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              width: ${designSettings.canvasWidth || 842}px;
              height: ${designSettings.canvasHeight || 595}px;
              background: ${designSettings.backgroundImage ? `url('${designSettings.backgroundImage}')` : '#ffffff'};
              background-size: cover;
              background-position: center;
              position: relative;
              font-family: Arial, sans-serif;
            }
            .text-field {
              position: absolute;
              color: #000000;
              font-size: 24px;
              line-height: 1.2;
            }
            .image-field {
              position: absolute;
            }
          </style>
        </head>
        <body>
      `;

      // Add text fields
      if (designSettings.textFields) {
        for (const textField of designSettings.textFields) {
          let text = textField.text;
          if (recipient.name) {
            text = text.replace(/\{name\}/g, recipient.name);
            text = text.replace(/\{recipient\}/g, recipient.name);
          }
          if (recipient.email) {
            text = text.replace(/\{email\}/g, recipient.email);
          }
          text = text.replace(/\{date\}/g, new Date().toLocaleDateString());
          
          // Check for recipient-specific overrides
          const overrides = textField.recipientOverrides?.[recipient.id];
          const x = overrides?.x ?? textField.x;
          const y = overrides?.y ?? textField.y;
          const fontSize = overrides?.fontSize ?? textField.fontSize;
          
          htmlContent += `
            <div class="text-field" style="
              left: ${x}px;
              top: ${y}px;
              color: ${textField.color || '#000000'};
              font-size: ${fontSize || 24}px;
              font-family: ${textField.fontFamily || 'Arial'};
            ">${text}</div>
          `;
        }
      }

      // Add image fields
      if (designSettings.imageFields) {
        for (const imageField of designSettings.imageFields) {
          htmlContent += `
            <div class="image-field" style="
              left: ${imageField.x}px;
              top: ${imageField.y}px;
              width: ${imageField.width || 100}px;
              height: ${imageField.height || 100}px;
            ">
              <img src="${imageField.url}" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          `;
        }
      }

      htmlContent += `
        </body>
        </html>
      `;

      // For now, return the HTML content as a text file
      // In a production environment, you would use a headless browser like Puppeteer
      // to convert HTML to PNG/PDF
      const htmlBuffer = Buffer.from(htmlContent, 'utf8');

      return {
        success: true,
        imageBuffer: htmlBuffer,
        fileName: `certificate_${recipient.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'recipient'}.html`,
        mimeType: 'text/html'
      };
    } catch (error) {
      console.error('Certificate generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  generateZip: async (data) => {
    const { recipients, designSettings, backgroundImage } = data;
    
    try {
      const zip = new JSZip();
      
      console.log(`🚀 Generating ${recipients.length} certificates...`);
      
      let successCount = 0;
      
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        console.log(`📄 Generating certificate ${i + 1}/${recipients.length} for ${recipient.name}`);
        
        const result = await module.exports.generate({
          recipient,
          designSettings: {
            ...designSettings,
            backgroundImage: backgroundImage || designSettings.backgroundImage
          }
        });
        
        if (result.success) {
          zip.file(result.fileName, result.imageBuffer);
          successCount++;
          console.log(`✅ Generated certificate for ${recipient.name}`);
        } else {
          console.error(`❌ Failed to generate certificate for ${recipient.name}:`, result.error);
        }
      }
      
      if (successCount === 0) {
        throw new Error('No certificates were generated successfully');
      }
      
      console.log(`📦 Successfully generated ${successCount} certificates`);
      
      // Generate ZIP with proper options
      const zipBuffer = await zip.generateAsync({ 
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      });
      
      console.log(`✅ ZIP generated successfully, size: ${zipBuffer.length} bytes`);
      
      return {
        success: true,
        fileName: `certificates_${new Date().toISOString().split('T')[0]}.zip`,
        zipBuffer: zipBuffer
      };
    } catch (error) {
      console.error('ZIP generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

