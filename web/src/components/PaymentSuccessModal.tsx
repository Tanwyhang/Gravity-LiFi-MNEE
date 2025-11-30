'use client';

import * as React from 'react';
import { X, Share2, CheckCircle, Copy, Check, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QRCode } from '@/components/ui/shadcn-io/qr-code';
import { QRDownload } from '@/components/ui/qr-download';

import { useRouter } from 'next/navigation';

export interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  amountUSD: string;
  amountToken?: string;
  tokenSymbol?: string;
  recipientAddress?: string;
  eventId?: string;
  config?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
  };
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  txHash,
  amountUSD,
  amountToken,
  tokenSymbol,
  recipientAddress,
  eventId,
  config
}: PaymentSuccessModalProps) {
  const router = useRouter();
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Default styles if config is missing
  const styles = {
    backgroundColor: config?.backgroundColor || '#09090b',
    primaryColor: config?.primaryColor || '#6366f1',
    textColor: config?.textColor || '#ffffff',
    borderColor: config?.borderColor || '#e5e7eb',
    borderRadius: config?.borderRadius !== undefined ? `${config.borderRadius}px` : '0.75rem',
  };

  // QR Code data with actual Etherscan link using the txHash
  const etherscanUrl = `https://etherscan.io/tx/${txHash}`;
  const qrData = etherscanUrl;

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(etherscanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Gravity Payment Successful',
        text: `Paid ${amountUSD} USD using Gravity Payment System`,
        url: etherscanUrl
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card
          className="relative overflow-hidden shadow-2xl"
          style={{
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            color: styles.textColor,
            borderColor: styles.borderColor,
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <div className="relative p-6">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${styles.primaryColor}20` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: 0.1 }}
                >
                  <CheckCircle className="w-6 h-6" style={{ color: styles.primaryColor }} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Payment Successful!</h2>
                  <p className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Transaction confirmed
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                style={{ color: styles.textColor, opacity: 0.7 }}
                className="hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: 0.15 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="space-y-6">
              {/* Amount Display */}
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: 0.18 }}
              >
                <motion.div
                  className="text-sm mb-2"
                  style={{ color: styles.primaryColor, opacity: 0.7 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ duration: 0.1, delay: 0.2 }}
                >
                  Amount Paid
                </motion.div>
                <motion.div
                  className="text-3xl font-bold mb-1"
                  style={{ color: styles.primaryColor }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: 0.22 }}
                >
                  ${amountUSD}
                </motion.div>
                {amountToken && tokenSymbol && (
                  <motion.div
                    className="text-sm"
                    style={{ color: styles.textColor, opacity: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.1, delay: 0.24 }}
                  >
                    ≈ {amountToken} {tokenSymbol}
                  </motion.div>
                )}
              </motion.div>

              {/* QR Code */}
              <motion.div
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.26 }}
              >
                <div className="w-full text-center">
                  <motion.div
                    className="text-xs font-bold mb-3 tracking-wider"
                    style={{ color: styles.primaryColor, opacity: 0.7 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.1, delay: 0.28 }}
                  >
                    [ SCAN_TO_VIEW_TRANSACTION ]
                  </motion.div>
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.3 }}
                  >
                    <div
                      ref={qrCodeRef}
                      className="p-4 rounded-lg border-2"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: styles.primaryColor
                      }}
                    >
                      <div className="w-48 h-48">
                        <QRCode
                          data={qrData}
                          foreground="#000000"
                          background="#ffffff"
                          robustness="L"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <motion.p
                    className="text-xs mb-4"
                    style={{ color: styles.textColor, opacity: 0.6 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.1, delay: 0.32 }}
                  >
                    Scan to view on Etherscan
                  </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="grid grid-cols-3 gap-2 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: 0.34 }}
                >
                  <QRDownload
                    qrCodeRef={qrCodeRef}
                    transactionHash={txHash}
                    amount={amountUSD}
                    tokenSymbol={tokenSymbol}
                    className="flex items-center justify-center gap-1 h-10 rounded text-xs font-bold tracking-wider hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `${styles.primaryColor}15`,
                      color: styles.primaryColor,
                      border: `1px solid ${styles.primaryColor}30`
                    }}
                    qrData={qrData}
                  />

                  <Button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1 h-10 text-xs font-bold tracking-wider hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: copied ? `${styles.primaryColor}30` : `${styles.primaryColor}15`,
                      color: styles.primaryColor,
                      border: `1px solid ${styles.primaryColor}30`
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        COPY
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1 h-10 text-xs font-bold tracking-wider hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `${styles.primaryColor}15`,
                      color: styles.primaryColor,
                      border: `1px solid ${styles.primaryColor}30`
                    }}
                  >
                    <Share2 className="w-3 h-3" />
                    SHARE
                  </Button>
                </motion.div>
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                className="space-y-3 border-t pt-4"
                style={{ borderColor: `${styles.primaryColor}20` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: 0.36 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Transaction
                  </span>
                  <div className="text-right">
                    <div className="text-xs font-mono" style={{ color: styles.primaryColor }}>
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </div>
                    <a
                      href={etherscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline hover:opacity-70 transition-opacity"
                      style={{ color: styles.primaryColor, opacity: 0.8 }}
                    >
                      View on Etherscan
                    </a>
                  </div>
                </div>

                {recipientAddress && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                      Recipient
                    </span>
                    <div className="text-xs font-mono text-right" style={{ color: styles.primaryColor }}>
                      {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}
                    </div>
                  </div>
                )}

                {eventId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                      Event ID
                    </span>
                    <span className="text-sm font-mono" style={{ color: styles.primaryColor }}>
                      {eventId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Time
                  </span>
                  <span className="text-sm" style={{ color: styles.primaryColor }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.38 }}
              >
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 font-bold tracking-wider"
                  style={{
                    backgroundColor: styles.primaryColor,
                    color: '#ffffff',
                    borderRadius: styles.borderRadius
                  }}
                >
                  [ DASHBOARD ]
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}