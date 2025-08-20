export const printQRSticker = (address: string, locationName: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=800');
  
  if (!printWindow) {
    alert('Please allow popups to print the QR sticker.');
    return;
  }

  // Create the HTML content for printing
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code Sticker - ${locationName}</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            
            .sticker {
              width: 4in;
              height: 4in;
              background: linear-gradient(135deg, #ffffff 0%, #ffffff 70%, #eff6ff 100%);
              border: 4px solid #bfdbfe;
              border-radius: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
              position: relative;
              overflow: hidden;
              padding: 20px;
            }
            
            .decoration-top {
              position: absolute;
              top: -20px;
              right: -20px;
              width: 40px;
              height: 40px;
              background: linear-gradient(225deg, rgba(147, 197, 253, 0.3) 0%, transparent 100%);
              border-radius: 50%;
            }
            
            .decoration-bottom {
              position: absolute;
              bottom: -15px;
              left: -15px;
              width: 30px;
              height: 30px;
              background: linear-gradient(45deg, rgba(196, 181, 253, 0.2) 0%, transparent 100%);
              border-radius: 50%;
            }
            
            .location-name {
              color: #1e40af;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              background: rgba(239, 246, 255, 0.6);
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid rgba(191, 219, 254, 0.3);
              margin-bottom: 16px;
            }
            
            .qr-container {
              background: white;
              padding: 12px;
              border-radius: 16px;
              border: 2px solid rgba(224, 231, 255, 0.5);
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
              margin-bottom: 16px;
            }
            
            .qr-code {
              width: 2.2in;
              height: 2.2in;
              border-radius: 8px;
              display: block !important;
              visibility: visible !important;
            }
            
            .brand-container {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(255, 255, 255, 0.5);
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid rgba(191, 219, 254, 0.5);
              margin-bottom: 12px;
            }
            
            .brand-text {
              color: #1e3a8a;
              font-weight: bold;
              font-size: 16px;
            }
            
            .instruction {
              color: rgba(59, 130, 246, 0.8);
              font-size: 12px;
              text-align: center;
              font-weight: 500;
            }
            
            .sparkle-1 {
              position: absolute;
              top: 24px;
              left: 32px;
              font-size: 20px;
              color: rgba(251, 191, 36, 0.6);
            }
            
            .sparkle-2 {
              position: absolute;
              top: 64px;
              right: 40px;
              font-size: 16px;
              color: rgba(59, 130, 246, 0.4);
            }
            
            .sparkle-3 {
              position: absolute;
              bottom: 48px;
              left: 24px;
              font-size: 14px;
              color: rgba(168, 85, 247, 0.5);
            }
          }
          
          @media screen {
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: system-ui, -apple-system, sans-serif;
              background: #f3f4f6;
            }
            
            .sticker {
              width: 320px;
              height: 320px;
              background: linear-gradient(135deg, #ffffff 0%, #ffffff 70%, #eff6ff 100%);
              border: 4px solid #bfdbfe;
              border-radius: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
              position: relative;
              overflow: hidden;
              padding: 20px;
            }
            
            .decoration-top {
              position: absolute;
              top: -20px;
              right: -20px;
              width: 40px;
              height: 40px;
              background: linear-gradient(225deg, rgba(147, 197, 253, 0.3) 0%, transparent 100%);
              border-radius: 50%;
            }
            
            .decoration-bottom {
              position: absolute;
              bottom: -15px;
              left: -15px;
              width: 30px;
              height: 30px;
              background: linear-gradient(45deg, rgba(196, 181, 253, 0.2) 0%, transparent 100%);
              border-radius: 50%;
            }
            
            .location-name {
              color: #1e40af;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              background: rgba(239, 246, 255, 0.6);
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid rgba(191, 219, 254, 0.3);
              margin-bottom: 16px;
            }
            
            .qr-container {
              background: white;
              padding: 12px;
              border-radius: 16px;
              border: 2px solid rgba(224, 231, 255, 0.5);
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
              margin-bottom: 16px;
            }
            
            .qr-code {
              width: 180px;
              height: 180px;
              border-radius: 8px;
              display: block !important;
              visibility: visible !important;
            }
            
            .brand-container {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(255, 255, 255, 0.5);
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid rgba(191, 219, 254, 0.5);
              margin-bottom: 12px;
            }
            
            .brand-text {
              color: #1e3a8a;
              font-weight: bold;
              font-size: 16px;
            }
            
            .instruction {
              color: rgba(59, 130, 246, 0.8);
              font-size: 12px;
              text-align: center;
              font-weight: 500;
            }
            
            .sparkle-1 {
              position: absolute;
              top: 24px;
              left: 32px;
              font-size: 20px;
              color: rgba(251, 191, 36, 0.6);
            }
            
            .sparkle-2 {
              position: absolute;
              top: 64px;
              right: 40px;
              font-size: 16px;
              color: rgba(59, 130, 246, 0.4);
            }
            
            .sparkle-3 {
              position: absolute;
              bottom: 48px;
              left: 24px;
              font-size: 14px;
              color: rgba(168, 85, 247, 0.5);
            }
            
            .print-button {
              position: fixed;
              bottom: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            
            .print-button:hover {
              background: #2563eb;
            }
          }
        </style>
      </head>
      <body>
        <div class="sticker" id="qr-sticker">
          <div class="decoration-top"></div>
          <div class="decoration-bottom"></div>
          
          ${locationName ? `<div class="location-name">${locationName}</div>` : ''}
          
          <div class="qr-container">
            <canvas class="qr-code" id="qr-canvas"></canvas>
          </div>
          
          <div class="brand-container">
            <div class="brand-text">Made with Base</div>
            <svg width="24" height="24" viewBox="0 0 249 249" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; margin-left: 8px;">
              <path d="M0 19.671C0 12.9332 0 9.56425 1.26956 6.97276C2.48511 4.49151 4.49151 2.48511 6.97276 1.26956C9.56425 0 12.9332 0 19.671 0H229.329C236.067 0 239.436 0 242.027 1.26956C244.508 2.48511 246.515 4.49151 247.73 6.97276C249 9.56425 249 12.9332 249 19.671V229.329C249 236.067 249 239.436 247.73 242.027C246.515 244.508 244.508 246.515 242.027 247.73C239.436 249 236.067 249 229.329 249H19.671C12.9332 249 9.56425 249 6.97276 247.73C4.49151 246.515 2.48511 244.508 1.26956 242.027C0 239.436 0 236.067 0 229.329V19.671Z" fill="#0052FF" />
            </svg>
          </div>
          
          <div class="instruction">✨ Scan to tip with crypto ✨</div>
          
          <div class="sparkle-1">⭐</div>
          <div class="sparkle-2">💎</div>
          <div class="sparkle-3">✨</div>
        </div>
        
        <button class="print-button">Print Sticker</button>
        
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
        <script>
          // Generate QR code after library loads
          function generateQRCode() {
            return new Promise((resolve) => {
              const canvas = document.getElementById('qr-canvas');
              const paymentUrl = 'ethereum:${address}';
              
              // Set canvas size explicitly
              canvas.width = 180;
              canvas.height = 180;
              
              if (typeof QRCode !== 'undefined') {
                QRCode.toCanvas(canvas, paymentUrl, {
                  width: 180,
                  margin: 2,
                  color: {
                    dark: '#1f2937',
                    light: '#ffffff'
                  },
                  errorCorrectionLevel: 'H'
                }, function (error) {
                  if (error) {
                    console.error('QR code generation failed:', error);
                    // Fallback: draw a placeholder
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#f3f4f6';
                    ctx.fillRect(0, 0, 180, 180);
                    ctx.fillStyle = '#6b7280';
                    ctx.font = '16px system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('QR Code', 90, 90);
                  } else {
                    console.log('QR code generated successfully');
                  }
                  resolve();
                });
              } else {
                // Retry if library not loaded yet
                setTimeout(() => generateQRCode().then(resolve), 100);
              }
            });
          }
          
          // Initialize QR code generation
          async function initializeSticker() {
            try {
              await generateQRCode();
              console.log('Sticker ready for printing');
              
              // If autoprint is requested, wait a bit more then print
              if (window.location.search.includes('autoprint')) {
                setTimeout(() => {
                  console.log('Auto-printing...');
                  window.print();
                }, 500);
              }
            } catch (error) {
              console.error('Failed to initialize sticker:', error);
            }
          }
          
          // Start initialization when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSticker);
          } else {
            initializeSticker();
          }
          
          // Add print button functionality
          document.addEventListener('DOMContentLoaded', () => {
            const printButton = document.querySelector('.print-button');
            if (printButton) {
              printButton.addEventListener('click', async () => {
                console.log('Print button clicked, ensuring QR is ready...');
                await generateQRCode(); // Regenerate if needed
                setTimeout(() => window.print(), 200);
              });
            }
          });
        </script>
      </body>
    </html>
  `;

  // Write content to the print window
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Focus the print window
  printWindow.focus();
};