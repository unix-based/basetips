'use client';

import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

interface QRStickerProps {
  address: string;
  locationName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}


const QRSticker: React.FC<QRStickerProps> = ({ 
  address, 
  locationName, 
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: {
      container: 'w-56 h-56 p-3',
      qr: 88,
      logo: 'w-4 h-4',
      title: 'text-sm',
      location: 'text-xs'
    },
    medium: {
      container: 'w-72 h-72 p-4',
      qr: 120,
      logo: 'w-5 h-5',
      title: 'text-sm',
      location: 'text-base'
    },
    large: {
      container: 'w-96 h-96 p-6',
      qr: 160,
      logo: 'w-6 h-6',
      title: 'text-base',
      location: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`
      ${currentSize.container}
      bg-gradient-to-br from-white via-white to-blue-50/30
      border-4 
      border-blue-200/60
      rounded-3xl 
      flex 
      flex-col 
      items-center 
      justify-center 
      shadow-xl 
      shadow-blue-100/50
      mx-auto
      relative
      overflow-hidden
      ${className}
    `}>
      {/* Cute background decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full -ml-6 -mb-6"></div>
      
      {/* Location name on top with cute styling */}
      {locationName && (
        <div className={`text-blue-800 text-center font-bold ${currentSize.location} bg-blue-50/60 px-4 py-1 rounded-full shadow-sm border border-blue-100/30 mb-3`}>
          {locationName}
        </div>
      )}
      
      {/* Real QR Code with cute styling */}
      <div className="mb-3 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-xl blur-sm scale-110"></div>
        <div className="relative bg-white p-2 rounded-xl shadow-md border-2 border-blue-100/50">
          <QRCodeGenerator 
            address={address}
            locationName={locationName}
            size={currentSize.qr}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
      
      {/* Made with Base text with cute styling */}
      <div className="flex items-center gap-2 mb-2 bg-white/50 px-3 py-1 rounded-full shadow-sm border border-blue-100/50">
        <span className={`font-bold text-blue-900 ${currentSize.title} drop-shadow-sm`}>Made with Base</span>
        <svg
          width={currentSize.logo.includes('w-4') ? 16 : currentSize.logo.includes('w-5') ? 20 : 24}
          height={currentSize.logo.includes('w-4') ? 16 : currentSize.logo.includes('w-5') ? 20 : 24}
          viewBox="0 0 249 249"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <path 
            d="M0 19.671C0 12.9332 0 9.56425 1.26956 6.97276C2.48511 4.49151 4.49151 2.48511 6.97276 1.26956C9.56425 0 12.9332 0 19.671 0H229.329C236.067 0 239.436 0 242.027 1.26956C244.508 2.48511 246.515 4.49151 247.73 6.97276C249 9.56425 249 12.9332 249 19.671V229.329C249 236.067 249 239.436 247.73 242.027C246.515 244.508 244.508 246.515 242.027 247.73C239.436 249 236.067 249 229.329 249H19.671C12.9332 249 9.56425 249 6.97276 247.73C4.49151 246.515 2.48511 244.508 1.26956 242.027C0 239.436 0 236.067 0 229.329V19.671Z" 
            fill="#0052FF" 
          />
        </svg>
      </div>
      
      {/* Cute tip instruction with emoji */}
      <div className="text-blue-600/80 text-xs text-center mt-1 max-w-full font-medium">
        ✨ Scan to tip with crypto ✨
      </div>
      
      {/* Cute sparkle decorations */}
      <div className="absolute top-4 left-6 text-yellow-300/60 text-lg">⭐</div>
      <div className="absolute top-12 right-8 text-blue-300/40 text-sm">💎</div>
      <div className="absolute bottom-8 left-4 text-purple-300/50 text-xs">✨</div>
    </div>
  );
};

export default QRSticker;