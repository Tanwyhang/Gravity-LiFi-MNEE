"use client";

import React from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

interface QRDownloadProps {
  qrCodeRef: React.RefObject<HTMLDivElement | null>;
  transactionHash: string;
  amount: string;
  tokenSymbol?: string;
  className?: string;
  style?: React.CSSProperties;
  qrData?: string;
}

export const QRDownload: React.FC<QRDownloadProps> = ({
  qrCodeRef,
  transactionHash,
  amount,
  tokenSymbol = '',
  className = "",
  style = {},
}) => {
  const handleDownload = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      const canvasElement = qrCodeRef.current.querySelector('canvas');

      const processCanvas = (sourceCanvas: HTMLCanvasElement | HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size for high resolution
        canvas.width = 540;
        canvas.height = 540;

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code centered
        ctx.drawImage(sourceCanvas, 170, 170, 200, 200);

        // Add payment context text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';

        // Title
        ctx.fillText('GRAVITY PAYMENT', canvas.width / 2, 50);
        ctx.font = '14px monospace';
        ctx.fillText(`Tx: ${transactionHash.slice(0, 10)}...${transactionHash.slice(-6)}`, canvas.width / 2, 430);

        const amountText = tokenSymbol
          ? `$ ${amount} ${tokenSymbol}`
          : `$ ${amount}`;
        ctx.fillText(amountText, canvas.width / 2, 500);

        // Download as PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `gravity-payment-${transactionHash.slice(0, 8)}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            toast.success("Etherscan QR Code downloaded!", {
              description: "QR code linking to transaction details saved as PNG.",
              dismissible: false,
              duration: 3000
            });
          }
        }, 'image/png');
      };

      if (canvasElement) {
        processCanvas(canvasElement);
      } else if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        img.onload = () => processCanvas(img);
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      } else {
        toast.error("QR Code not ready", {
          description: "Please wait for the QR code to fully load.",
          dismissible: false,
          duration: 3000
        });
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={`hover:opacity-70 transition-opacity flex items-center justify-center gap-1 py-2 text-xs font-bold tracking-wider rounded animate-in fade-in duration-300 w-full ${className}`}
      style={style}
    >
      <Download className="w-3 h-3" />
      DOWNLOAD
    </button>
  );
};