'use client';

import React, { useState, useEffect } from 'react';
import { generateQRCodeDataURL } from '../utils/qr-generator';

interface QRCodeGeneratorProps {
  address: string;
  locationName?: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  address, 
  locationName, 
  size = 128, 
  className = '' 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      if (!address) {
        setError('No address provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Generate QR code with high error correction and appropriate size
        const qrCodeDataUrl = await generateQRCodeDataURL(address, {
          width: size * 2, // Higher resolution for better quality
          margin: 2,
          color: {
            dark: '#1f2937', // Slightly softer black for better aesthetics
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H' // High error correction for better scanning
        });
        
        setQrCodeUrl(qrCodeDataUrl);
      } catch (err) {
        console.error('QR code generation failed:', err);
        setError('Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [address, size]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
           style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
           style={{ width: size, height: size }}>
        <span className="text-sm text-red-500">Error</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {qrCodeUrl && (
        <img 
          src={qrCodeUrl} 
          alt={`QR Code for ${locationName || 'payment'}`}
          className="rounded-lg image-render-crisp-edges"
          style={{ 
            width: size, 
            height: size,
            imageRendering: 'crisp-edges' as const,
            filter: 'contrast(1.1) saturate(1.05)'
          }}
        />
      )}
    </div>
  );
};

export default QRCodeGenerator;