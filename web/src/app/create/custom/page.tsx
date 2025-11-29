"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useAccount } from "wagmi"
import { Upload, Eye, ArrowLeft, Copy, Download, X } from "lucide-react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Slider } from "@/components/ui/slider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { QRCode } from "@/components/ui/shadcn-io/qr-code"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { QRDownload } from "@/components/ui/qr-download"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PaymentConfig {
  template: 'thumbnail'
  theme: 'custom' | 'dark' | 'light' | 'gradient' | 'neon'
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  customThumbnail: string | null // Supports static images and animated GIFs
  tokenSymbol: string
  tokenAmount: string
  usdAmount: string
  networkCost: string
  processingTime: string
  merchantName: string
  transactionId: string
  customTitle: string
  recipientAddress: string
  borderRadius: number
  showTransactionId: boolean
  showProcessingTime: boolean
  buttonStyle: 'solid' | 'gradient' | 'outline' | 'glow'
  animation: 'none' | 'pulse' | 'bounce' | 'glow'
  showQRCode: boolean
}

import dynamic from "next/dynamic";

const WalletConnectButton = dynamic(
  () => import("@/components/WalletConnectButton").then((mod) => mod.WalletConnectButton),
  { ssr: false }
);

export default function CustomThumbnailPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const linkQrCodeRef = useRef<HTMLDivElement>(null)
  const { address } = useAccount()

  const [config, setConfig] = useState<PaymentConfig>({
    template: 'thumbnail',
    theme: 'custom',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#e5e7eb',
    customThumbnail: null,
    tokenSymbol: 'ETH',
    tokenAmount: '0.05',
    usdAmount: '124.50',
    networkCost: '0.002',
    processingTime: '~15 SEC',
    merchantName: 'GRAVITY_PAY',
    transactionId: '#DEMO123',
    customTitle: 'PAY_WITH_CRYPTO',
    recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
    borderRadius: 12,
    showTransactionId: true,
    showProcessingTime: true,
    buttonStyle: 'solid',
    animation: 'pulse',
    showQRCode: true,
  })

  useEffect(() => {
    if (address) {
      setConfig(prev => {
        if (prev.recipientAddress === '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45' || prev.recipientAddress === '') {
          return { ...prev, recipientAddress: address }
        }
        return prev
      })
    }
  }, [address])

  const themes = {
    walrus: {
      primaryColor: '#243370',
      backgroundColor: '#d6fffa',
      textColor: '#000000',
      borderColor: '#030303',
    },
    dark: {
      primaryColor: '#ffffffff',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      borderColor: '#333333',
    },
    light: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e5e7eb',
    },
    neon: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#0a0a0a',
      textColor: '#8b5cf6',
      borderColor: '#8b5cf6',
    },
  }

  const updateConfig = useCallback((key: keyof PaymentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const validateUSDAmount = useCallback((value: string) => {
    // Only allow numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '')
    // Ensure only one decimal point
    const parts = cleanValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    return cleanValue
  }, [])

  const applyTheme = (theme: keyof typeof themes) => {
    const themeConfig = themes[theme]
    updateConfig('theme', theme)
    Object.entries(themeConfig).forEach(([key, value]) => {
      updateConfig(key as keyof PaymentConfig, value)
    })
  }

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB for images and GIFs.")
      return
    }

    setIsUploading(true)
    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        },
      );

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const newBlob = await response.json();
      updateConfig('customThumbnail', newBlob.url)
      toast.success("Logo uploaded successfully!")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload logo")
    } finally {
      setIsUploading(false)
    }
  }, [updateConfig])

  const handlePayment = useCallback(async () => {
    if (isProcessing) return

    setIsProcessing(true)
    setPaymentStatus('processing')
    setTransactionHash(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockTxHash = '0x' + Array.from({length: 64}, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')

      setTransactionHash(mockTxHash)
      setPaymentStatus('success')
      setShowSuccessModal(true)
      setIsProcessing(false)

    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus('error')
      setTimeout(() => {
        setPaymentStatus('idle')
        setIsProcessing(false)
      }, 2000)
    }
  }, [isProcessing])

  const handleGenerateLink = useCallback(() => {
    const uniqueId = Math.random().toString(36).substring(2, 9)
    // Use shorter param names to reduce QR code complexity
    const params = new URLSearchParams({
      pc: config.primaryColor,
      bg: config.backgroundColor,
      tc: config.textColor,
      bc: config.borderColor,
      br: config.borderRadius.toString(),
      bs: config.buttonStyle,
      ts: config.tokenSymbol,
      ta: config.tokenAmount,
      mn: config.merchantName,
      ti: config.transactionId,
      ct: config.customTitle,
      ra: config.recipientAddress,
      st: config.showTransactionId.toString(),
      an: config.animation,
      ua: config.usdAmount,
    })
    // Include thumbnail if present (it's a Vercel Blob URL, not base64, so it's reasonable length)
    if (config.customThumbnail) {
      params.append('th', config.customThumbnail);
    }
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/pay/${uniqueId}?${params.toString()}`
    setGeneratedLink(link)
    toast.success("Payment link generated!")
  }, [config])

  const handleDownloadLinkQR = useCallback(() => {
    if (linkQrCodeRef.current) {
      const svgElement = linkQrCodeRef.current.querySelector('svg');
      const canvasElement = linkQrCodeRef.current.querySelector('canvas');

      const processCanvas = (sourceCanvas: HTMLCanvasElement | HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size (add some padding)
        const padding = 40;
        const size = 500;
        canvas.width = size;
        canvas.height = size;

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code centered
        ctx.drawImage(sourceCanvas, padding, padding, size - (padding * 2), size - (padding * 2));
        
        // Add text at bottom
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO PAY', canvas.width / 2, canvas.height - 15);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `gravity-payment-link.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            toast.success("QR Code downloaded!");
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
      }
    }
  }, []);

  const PaymentModalPreview = useMemo(() => {
    const getButtonStyle = () => {
      const baseClasses = "w-full py-3 font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden transition-all"
      const animationClasses = {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        glow: 'shadow-lg'
      }

      switch (config.buttonStyle) {
        case 'solid':
          return `${baseClasses} ${animationClasses[config.animation]} hover:opacity-90`
        case 'gradient':
          return `${baseClasses} ${animationClasses[config.animation]} hover:opacity-90`
        case 'outline':
          return `${baseClasses} ${animationClasses[config.animation]} border-2 hover:opacity-90`
        case 'glow':
          return `${baseClasses} ${animationClasses[config.animation]} shadow-lg hover:shadow-xl`
        default:
          return baseClasses
      }
    }

    const getButtonBackground = () => {
      switch (config.buttonStyle) {
        case 'gradient':
          return `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}dd)`
        case 'outline':
          return 'transparent'
        case 'glow':
          return config.primaryColor
        default:
          return config.primaryColor
      }
    }

    const getButtonBorderColor = () => {
      return config.buttonStyle === 'outline' ? config.primaryColor : 'transparent'
    }

    const getButtonTextColor = () => {
      if (config.buttonStyle === 'outline') {
        return config.primaryColor
      }

      // For solid, gradient, and glow styles, use contrasting color
      // Simple luminance calculation for white/black text determination
      const color = config.primaryColor.replace('#', '')
      const r = parseInt(color.substr(0, 2), 16)
      const g = parseInt(color.substr(2, 2), 16)
      const b = parseInt(color.substr(4, 2), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      return luminance > 0.5 ? '#000000' : '#ffffff'
    }

    return (
      <div
        className="relative backdrop-blur-xl p-8 md:p-10 shadow-2xl transition-all duration-300 w-full"
        style={{
          borderRadius: `${config.borderRadius}px`,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderWidth: '2px',
          borderStyle: 'solid'
        }}
      >
        {(config.buttonStyle === 'glow' || config.animation === 'glow') && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl opacity-20 blur-xl"
            style={{ backgroundColor: config.primaryColor }}
          />
        )}

        <div className="relative">
          {/* Brand Logo Row - Image upload or thumbnail */}
          <div className="flex justify-center mb-6">
            {config.customThumbnail ? (
              <div className="w-full rounded-lg overflow-hidden relative group bg-black/5" style={{ borderRadius: `${Math.min(config.borderRadius / 2, 8)}px` }}>
                <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
                  <img
                    src={config.customThumbnail}
                    alt="Merchant logo"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="thumbnail-upload-preview"
                    disabled={isUploading}
                  />
                  <label htmlFor="thumbnail-upload-preview" className="cursor-pointer text-white text-xs font-medium flex items-center gap-2">
                    {isUploading ? <Spinner className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'UPLOADING...' : 'CHANGE_IMAGE'}
                  </label>
                </div>
                <label htmlFor="thumbnail-upload-preview" className="absolute inset-0 cursor-pointer" />
              </div>
            ) : (
              <div className="w-full rounded-lg border-2 border-dashed border-border" style={{ borderRadius: `${Math.min(config.borderRadius / 2, 8)}px` }}>
                <AspectRatio ratio={16 / 9} className="flex items-center justify-center hover:border-foreground/50 transition-colors">
                <input
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="thumbnail-upload-preview"
                />
                <label htmlFor="thumbnail-upload-preview" className="cursor-pointer space-y-2 text-center">
                  {isUploading ? (
                    <Spinner className="w-6 h-6 mx-auto text-muted-foreground" />
                  ) : (
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                  )}
                  <div className="text-xs text-muted-foreground">{isUploading ? 'UPLOADING...' : 'UPLOAD_LOGO_OR_GIF'}</div>
                </label>
                </AspectRatio>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={config.customTitle}
                onChange={(e) => updateConfig('customTitle', e.target.value)}
                className="font-bold text-sm bg-transparent border-2 border-transparent hover:border-black focus:border-current rounded px-2 py-1 outline-none transition-colors"
                style={{ color: config.primaryColor }}
                placeholder="PAYMENT_TITLE"
              />
              <input
                type="text"
                value={config.merchantName}
                onChange={(e) => updateConfig('merchantName', e.target.value)}
                className="text-xs bg-transparent border-2 border-transparent hover:border-black focus:border-current rounded px-2 py-1 outline-none transition-colors"
                style={{ color: config.primaryColor, opacity: 0.8 }}
                placeholder="Merchant Name"
              />
            </div>
            {config.showTransactionId && (
              <input
                type="text"
                value={config.transactionId}
                onChange={(e) => updateConfig('transactionId', e.target.value)}
                className="text-xs font-mono bg-transparent border-2 border-transparent hover:border-black focus:border-current rounded px-2 py-1 outline-none transition-colors text-right truncate max-w-[100px]"
                style={{ color: config.primaryColor, opacity: 0.6 }}
                placeholder="#TXN_ID"
              />
            )}
          </div>

          <div className="text-center mb-8 space-y-1">
            <div
              className="text-sm mb-1"
              style={{ color: config.primaryColor, opacity: 0.7 }}
            >
              ≈ {config.tokenAmount}{' '}
              <input
                type="text"
                value={config.tokenSymbol}
                onChange={(e) => updateConfig('tokenSymbol', e.target.value)}
                className="bg-transparent border-2 border-transparent hover:border-black focus:border-current rounded px-1 py-0.5 outline-none transition-colors text-center font-bold"
                style={{ color: config.primaryColor, opacity: 0.9, width: '40px' }}
                placeholder="TOKEN"
              />
            </div>
            <div className="relative inline-block">
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-4xl font-bold tracking-tighter"
                style={{ color: config.primaryColor, opacity: 0.5 }}
              >
                $
              </span>
              <input
                type="number"
                value={config.usdAmount}
                className="text-4xl font-bold tracking-tighter bg-transparent border-2 border-transparent hover:border-black focus:opacity-70 rounded pl-10 pr-3 py-1 text-center w-48 outline-none transition-all cursor-text"
                style={{
                  color: config.primaryColor,
                  borderColor: config.primaryColor + '20',
                }}
                step="0.01"
                min="0"
                onChange={(e) => {
                  const newUsdAmount = e.target.value;
                  const newTokenAmount = (parseFloat(newUsdAmount) / 2490).toFixed(4);
                  setConfig(prev => ({
                    ...prev,
                    usdAmount: newUsdAmount,
                    tokenAmount: newTokenAmount
                  }));
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <div
              className="text-xs mb-2 font-bold"
              style={{ color: config.primaryColor, opacity: 0.7 }}
            >
              RECIPIENT_ADDRESS
            </div>
            <input
              type="text"
              value={config.recipientAddress}
              onChange={(e) => updateConfig('recipientAddress', e.target.value)}
              className="w-full text-xs font-mono bg-transparent border-2 rounded px-3 py-2 outline-none transition-all"
              style={{
                color: config.primaryColor,
                borderColor: config.primaryColor + '30',
                backgroundColor: config.primaryColor + '05'
              }}
              placeholder="0x..."
            />
          </div>

          <div className="space-y-3 mb-6">
            <div
              className="flex justify-between text-sm p-3 border"
              style={{
                borderRadius: `${Math.max(config.borderRadius - 4, 4)}px`,
                backgroundColor: config.primaryColor + '10',
                borderColor: config.borderColor,
                color: config.primaryColor,
                opacity: 0.8
              }}
            >
              <span style={{ opacity: 0.7 }}>Network</span>
              <span className="font-mono text-xs">ERC20</span>
            </div>
              </div>

          {paymentStatus === 'idle' && (
            <button
              onClick={handlePayment}
              className={getButtonStyle()}
              style={{
                borderRadius: `${Math.max(config.borderRadius - 2, 6)}px`,
                backgroundColor: getButtonBackground(),
                borderColor: getButtonBorderColor(),
                color: getButtonTextColor()
              }}
            >
              <span className="relative z-10">CONFIRM_PAYMENT</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse relative z-10" />
              {config.buttonStyle === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              )}
              {config.buttonStyle === 'glow' && (
                <div
                  className="absolute inset-0 opacity-40 blur-sm"
                  style={{ backgroundColor: config.primaryColor }}
                />
              )}
            </button>
          )}

          {paymentStatus === 'processing' && (
            <button
              disabled
              className={getButtonStyle()}
              style={{
                borderRadius: `${Math.max(config.borderRadius - 2, 6)}px`,
                backgroundColor: getButtonBackground(),
                borderColor: getButtonBorderColor(),
                color: getButtonTextColor(),
                opacity: 0.7
              }}
            >
              <span className="relative z-10">PROCESSING...</span>
              <Spinner variant="ring" size={16} className="relative z-10" />
            </button>
          )}

          {paymentStatus === 'success' && (
            <button
              disabled
              className={getButtonStyle()}
              style={{
                borderRadius: `${Math.max(config.borderRadius - 2, 6)}px`,
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                color: '#ffffff'
              }}
            >
              <span className="relative z-10">PAYMENT_SUCCESS</span>
              <div className="w-2 h-2 bg-white rounded-full relative z-10" />
            </button>
          )}

          </div>
      </div>
    )
  }, [config, updateConfig, paymentStatus, transactionHash, handlePayment, handleImageUpload])

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">


      <main className="relative">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12 relative z-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-3 sm:space-y-4 px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter">CUSTOMIZE_YOUR_MODAL</h2>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
                  Add your brand logo and customize every aspect of your payment modal.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto px-2 sm:px-0">
                <div className="space-y-6">
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-bold">PRESET_THEMES</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.keys(themes).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => applyTheme(theme as keyof typeof themes)}
                          className={`px-3 py-2 text-xs font-bold border rounded-lg transition-all ${
                            config.theme === theme
                              ? 'border-foreground bg-foreground/10'
                              : 'border-border hover:border-foreground/50'
                          }`}
                        >
                          {theme.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold">COLOR_CUSTOMIZATION</label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">PRIMARY_COLOR</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig('primaryColor', e.target.value)}
                            className="w-10 h-10 rounded border-2 border-border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig('primaryColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs font-mono border border-border rounded bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">BACKGROUND_COLOR</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={typeof config.backgroundColor === 'string' && config.backgroundColor.startsWith('#') ? config.backgroundColor : '#ffffff'}
                            onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                            className="w-10 h-10 rounded border-2 border-border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={typeof config.backgroundColor === 'string' && config.backgroundColor.startsWith('#') ? config.backgroundColor : '#ffffff'}
                            onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs font-mono border border-border rounded bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">BORDER_COLOR</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.borderColor}
                            onChange={(e) => updateConfig('borderColor', e.target.value)}
                            className="w-10 h-10 rounded border-2 border-border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.borderColor}
                            onChange={(e) => updateConfig('borderColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs font-mono border border-border rounded bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground">BORDER_RADIUS</label>
                        <Slider
                          value={[config.borderRadius]}
                          onValueChange={([value]) => updateConfig('borderRadius', value)}
                          max={24}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-center">{config.borderRadius}px</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold">ADVANCED_SETTINGS</label>
                    <div className="divide-y rounded-lg border bg-background">
                      <div className="flex items-center justify-between gap-4 p-4">
                        <div className="flex flex-col gap-1">
                          <Label className="font-medium" htmlFor="showQRCode">
                            SHOW_QR_CODE
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            Display QR code in success modal
                          </p>
                        </div>
                        <Switch
                          id="showQRCode"
                          checked={config.showQRCode}
                          onCheckedChange={(checked) => updateConfig('showQRCode', checked)}
                        />
                      </div>
                      </div>
                    </div>

              <Button 
                className="w-full py-6 text-lg font-bold mt-6 shadow-xl hover:scale-[1.02] transition-transform"
                onClick={handleGenerateLink}
              >
                GENERATE_LINK
              </Button>
              </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="sticky top-4 flex flex-col items-center px-2">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-bold">LIVE_PREVIEW</span>
                    </div>
                    <div className="w-full max-w-sm sm:max-w-md">
                      {PaymentModalPreview}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Success Modal */}
        {showSuccessModal && transactionHash && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="relative backdrop-blur-xl p-6 shadow-2xl max-w-sm w-full animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
              style={{
                borderRadius: `${config.borderRadius}px`,
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setPaymentStatus('idle')
                  setTransactionHash(null)
                }}
                className="absolute top-2 right-2 text-black/50 hover:text-black transition-colors"
                style={{ color: config.primaryColor + '80' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500 delay-100">
                  <svg className="w-6 h-6 text-green-600 animate-in spin-in-12 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3
                  className="text-lg font-bold animate-in slide-in-from-top-2 duration-300 delay-150"
                  style={{ color: config.primaryColor }}
                >
                  PAYMENT_SUCCESS
                </h3>

                {config.showQRCode && (
                  <>
                    <div className="flex justify-center mb-4 animate-in fade-in duration-500 delay-200">
                      <div className="rounded-lg overflow-hidden bg-white p-2 relative" ref={qrCodeRef}>
                        <QRCode
                          data={`https://etherscan.io/tx/${transactionHash}`}
                          className="w-28 h-28"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-black/60 animate-in fade-in duration-500 delay-300 max-w-xs mx-auto mb-4">
                      Scan QR to view transaction on Etherscan
                    </p>
                  </>
                )}

                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                  <div
                    className="text-xs font-bold"
                    style={{ color: config.primaryColor, opacity: 0.7 }}
                  >
                    TRANSACTION_HASH
                  </div>
                  <div className="text-xs font-mono break-all bg-black/5 p-2 rounded">
                    {transactionHash}
                  </div>
                  <div className={config.showQRCode ? "grid grid-cols-2 gap-2" : ""}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transactionHash);
                        toast.success("Transaction hash copied to clipboard!", {
                          description: "You can now paste it for verification purposes.",
                          dismissible: false,
                          duration: 4000,
                          action: {
                            label: "View on Etherscan",
                            onClick: () => window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank')
                          }
                        });
                      }}
                      className="hover:opacity-70 transition-opacity flex items-center justify-center gap-1 py-2 text-xs font-medium rounded animate-in fade-in duration-300 hover:scale-105 w-full"
                      style={{
                        color: config.primaryColor,
                        backgroundColor: config.primaryColor + '10',
                        border: `1px solid ${config.primaryColor + '30'}`
                      }}
                    >
                      <Copy className="w-3 h-3" />
                      COPY_HASH
                    </button>
                    {config.showQRCode && (
                      <QRDownload
                        qrCodeRef={qrCodeRef}
                        transactionHash={transactionHash}
                        amount={config.usdAmount}
                        tokenSymbol={config.tokenSymbol}
                        style={{
                          color: config.primaryColor,
                          backgroundColor: config.primaryColor + '10',
                          border: `1px solid ${config.primaryColor + '30'}`
                        }}
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setPaymentStatus('idle')
                    setTransactionHash(null)
                  }}
                  className="w-full py-2 text-xs font-bold rounded transition-all animate-in fade-in slide-in-from-bottom-3 duration-500 delay-400 hover:scale-105"
                  style={{
                    backgroundColor: config.primaryColor,
                    color: getLuminance(config.primaryColor) > 0.5 ? '#000000' : '#ffffff'
                  }}
                >
                  [ DASHBOARD ]
                </button>
              </div>
            </div>
          </div>
        )}
        {generatedLink && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border p-6 rounded-xl shadow-2xl max-w-md w-full space-y-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
              <div className="text-center space-y-2 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full hover:bg-muted"
                  onClick={() => setGeneratedLink(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">PAYMENT_LINK_READY</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment link has been generated successfully.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 py-4 border-y border-border/50">
                <div className="bg-white p-4 rounded-xl shadow-sm" ref={linkQrCodeRef}>
                  <QRCode
                    data={generatedLink}
                    className="w-48 h-48"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadLinkQR} className="w-full max-w-[200px]">
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD_QR
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border break-all font-mono text-sm text-center select-all">
                {generatedLink}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  toast.success("Link copied to clipboard");
                }}>
                  COPY_LINK
                </Button>
                <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full">OPEN_PAGE</Button>
                </a>
              </div>


            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function for luminance calculation
const getLuminance = (color: string) => {
  const hexColor = color.replace('#', '')
  const r = parseInt(hexColor.substr(0, 2), 16)
  const g = parseInt(hexColor.substr(2, 2), 16)
  const b = parseInt(hexColor.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}