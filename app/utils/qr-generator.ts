import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generates QR code as a data URL for a given Ethereum address
 */
export async function generateQRCodeDataURL(
  address: string, 
  options: QROptions = {}
): Promise<string> {
  const defaultOptions: QROptions = {
    width: 360, // Higher resolution for better quality
    margin: 2,
    color: {
      dark: '#1f2937',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  };

  const finalOptions = { ...defaultOptions, ...options };
  const paymentUrl = `ethereum:${address}`;
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, finalOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates QR code as a canvas element for a given Ethereum address
 */
export async function generateQRCodeCanvas(
  address: string,
  canvas: HTMLCanvasElement,
  options: QROptions = {}
): Promise<void> {
  const defaultOptions: QROptions = {
    width: 180,
    margin: 2,
    color: {
      dark: '#1f2937',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  };

  const finalOptions = { ...defaultOptions, ...options };
  const paymentUrl = `ethereum:${address}`;
  
  try {
    await QRCode.toCanvas(canvas, paymentUrl, finalOptions);
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Creates a temporary QR code image for use in print operations
 */
export async function createTempQRImage(
  address: string,
  options: QROptions = {}
): Promise<string> {
  // Generate QR code as data URL with high resolution for printing
  const printOptions: QROptions = {
    width: 400, // High resolution for print quality
    margin: 2,
    color: {
      dark: '#1f2937',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H',
    ...options
  };

  return await generateQRCodeDataURL(address, printOptions);
}
