import { generateQRCodeDataURL } from './qr-generator';

export const downloadQRSticker = async (
  address: string,
  locationName: string,
  size: number = 400
) => {
  try {
    // Generate QR code with high quality settings
    const qrCodeDataUrl = await generateQRCodeDataURL(address, {
      width: size * 2, // Higher resolution
      margin: 2,
      color: {
        dark: '#1f2937', // Softer black
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });

    // Create a canvas to compose the full sticker
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size for sticker with higher resolution for quality
    const stickerSize = 800; // Larger for better quality
    canvas.width = stickerSize;
    canvas.height = stickerSize;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill background with cute gradient
    const gradient = ctx.createLinearGradient(0, 0, stickerSize, stickerSize);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.7, '#ffffff');
    gradient.addColorStop(1, '#eff6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, stickerSize, stickerSize);

    // Draw cute rounded border (outer)
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 12;
    ctx.beginPath();
    const borderRadius = 48;
    ctx.moveTo(6 + borderRadius, 6);
    ctx.lineTo(stickerSize - 6 - borderRadius, 6);
    ctx.quadraticCurveTo(stickerSize - 6, 6, stickerSize - 6, 6 + borderRadius);
    ctx.lineTo(stickerSize - 6, stickerSize - 6 - borderRadius);
    ctx.quadraticCurveTo(stickerSize - 6, stickerSize - 6, stickerSize - 6 - borderRadius, stickerSize - 6);
    ctx.lineTo(6 + borderRadius, stickerSize - 6);
    ctx.quadraticCurveTo(6, stickerSize - 6, 6, stickerSize - 6 - borderRadius);
    ctx.lineTo(6, 6 + borderRadius);
    ctx.quadraticCurveTo(6, 6, 6 + borderRadius, 6);
    ctx.closePath();
    ctx.stroke();
    
    // Add inner border for depth
    ctx.strokeStyle = '#dbeafe';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const innerRadius = 36;
    ctx.moveTo(18 + innerRadius, 18);
    ctx.lineTo(stickerSize - 18 - innerRadius, 18);
    ctx.quadraticCurveTo(stickerSize - 18, 18, stickerSize - 18, 18 + innerRadius);
    ctx.lineTo(stickerSize - 18, stickerSize - 18 - innerRadius);
    ctx.quadraticCurveTo(stickerSize - 18, stickerSize - 18, stickerSize - 18 - innerRadius, stickerSize - 18);
    ctx.lineTo(18 + innerRadius, stickerSize - 18);
    ctx.quadraticCurveTo(18, stickerSize - 18, 18, stickerSize - 18 - innerRadius);
    ctx.lineTo(18, 18 + innerRadius);
    ctx.quadraticCurveTo(18, 18, 18 + innerRadius, 18);
    ctx.closePath();
    ctx.stroke();
    
    // Add cute background decorations
    ctx.fillStyle = 'rgba(147, 197, 253, 0.3)';
    ctx.beginPath();
    ctx.arc(stickerSize - 60, 60, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(196, 181, 253, 0.2)';
    ctx.beginPath();
    ctx.arc(60, stickerSize - 60, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Load and draw QR code
    const qrImg = new Image();
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.src = qrCodeDataUrl;
    });

    // Draw QR code background with cute styling
    const qrSize = 320; // Larger QR code for better scanning
    const qrX = (stickerSize - qrSize) / 2;
    const qrY = 100;
    
    // Draw QR code background with shadow effect
    ctx.shadowColor = 'rgba(59, 130, 246, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw QR code border
    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
    
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Add rounded corners to QR code (visual effect)
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    const radius = 12;
    ctx.moveTo(qrX + radius, qrY);
    ctx.lineTo(qrX + qrSize - radius, qrY);
    ctx.quadraticCurveTo(qrX + qrSize, qrY, qrX + qrSize, qrY + radius);
    ctx.lineTo(qrX + qrSize, qrY + qrSize - radius);
    ctx.quadraticCurveTo(qrX + qrSize, qrY + qrSize, qrX + qrSize - radius, qrY + qrSize);
    ctx.lineTo(qrX + radius, qrY + qrSize);
    ctx.quadraticCurveTo(qrX, qrY + qrSize, qrX, qrY + qrSize - radius);
    ctx.lineTo(qrX, qrY + radius);
    ctx.quadraticCurveTo(qrX, qrY, qrX + radius, qrY);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw location name first if provided with cute styling
    const titleY = qrY + qrSize + 60;
    if (locationName) {
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      
      // Add text shadow
      ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillText(locationName, stickerSize / 2, titleY);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw "Made with Base" text and Base logo
    const basetipsY = locationName ? titleY + 45 : titleY;
    
    // Draw "Made with Base" text with cute styling
    ctx.fillStyle = '#1e3a8a'; // Blue color
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    // Add text shadow
    ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText('Made with Base', stickerSize / 2, basetipsY);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw Base square logo after the text (official Base.org design)
    const logoSize = 24;
    const logoX = stickerSize / 2 + 70; // Position to the right of text
    const logoY = basetipsY - logoSize / 2 - 5;
    
    // Draw the Base square with rounded corners
    const cornerRadius = 3;
    ctx.fillStyle = '#0052FF';
    ctx.beginPath();
    ctx.moveTo(logoX + cornerRadius, logoY);
    ctx.lineTo(logoX + logoSize - cornerRadius, logoY);
    ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + cornerRadius);
    ctx.lineTo(logoX + logoSize, logoY + logoSize - cornerRadius);
    ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - cornerRadius, logoY + logoSize);
    ctx.lineTo(logoX + cornerRadius, logoY + logoSize);
    ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - cornerRadius);
    ctx.lineTo(logoX, logoY + cornerRadius);
    ctx.quadraticCurveTo(logoX, logoY, logoX + cornerRadius, logoY);
    ctx.closePath();
    ctx.fill();

    // Draw instruction text with emojis
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    const instructionY = locationName ? basetipsY + 40 : basetipsY + 40;
    ctx.fillText('✨ Scan to tip with crypto ✨', stickerSize / 2, instructionY);
    
    // Add cute decorative elements (emojis)
    ctx.font = '36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24'; // Yellow
    ctx.fillText('⭐', 120, 160);
    ctx.fillStyle = '#3b82f6'; // Blue  
    ctx.fillText('💎', stickerSize - 120, 180);
    ctx.fillStyle = '#a855f7'; // Purple
    ctx.fillText('✨', 100, stickerSize - 150);
    
    // Add more sparkles for cuteness
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#fde047'; // Light yellow
    ctx.fillText('✨', stickerSize - 80, stickerSize - 100);
    ctx.fillStyle = '#c084fc'; // Light purple
    ctx.fillText('💫', stickerSize - 140, 120);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${locationName.replace(/\s+/g, '-').toLowerCase()}-qr-sticker.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

  } catch (error) {
    console.error('Failed to download QR sticker:', error);
    alert('Failed to download QR code. Please try again.');
  }
};