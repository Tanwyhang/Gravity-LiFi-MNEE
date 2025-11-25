# QR Code Implementation Upgrade

## Summary
Successfully replaced the existing QR code implementation with `react-qrcode-logo` to enable fluid design with custom logo integration.

## Changes Made

### 1. Core QR Code Component (`web/src/components/ui/shadcn-io/qr-code/index.tsx`)
- **Replaced**: `qrcode` library with `react-qrcode-logo`
- **Added Features**:
  - Dots QR code style (`qrStyle="dots"`)
  - Logo integration from `/logo.png`
  - Dynamic sizing with ResizeObserver
  - Logo padding with circular style
  - Removed QR cells behind logo for better visibility
  - Eye radius customization (rounded corners on position markers)
  - CORS support for external logo images
  - **Reduced Complexity**: Default robustness set to 'L' (Low) for cleaner appearance

- **Configuration**:
  ```typescript
  <ReactQRCode
    value={data}
    size={size}
    bgColor={colors.bg}
    fgColor={colors.fg}
    ecLevel={robustness} // Defaults to 'L'
    qrStyle="dots"
    logoImage="/logo.png"
    logoWidth={size * 0.25}
    logoHeight={size * 0.25}
    removeQrCodeBehindLogo={true}
    logoPadding={5}
    logoPaddingStyle="circle"
    eyeRadius={10}
    enableCORS={true}
  />
  ```

### 2. QR Download Component (`web/src/components/ui/qr-download.tsx`)
- **Updated**: Download functionality to support both Canvas and SVG elements
- **Reason**: `react-qrcode-logo` renders to Canvas instead of SVG
- **Backward Compatible**: Still supports SVG-based QR codes

### 3. Custom Page Download Handler (`web/src/app/create/custom/page.tsx`)
- **Updated**: `handleDownloadLinkQR` function to support Canvas elements
- **Maintains**: Same download functionality with PNG output

## Benefits

1. **Visual Appeal**: Fluid design creates a more modern, organic look
2. **Branding**: Logo integration in the center of QR codes
3. **Readability**: Automatic removal of QR cells behind logo ensures scannability
4. **Flexibility**: Dynamic sizing adapts to container dimensions
5. **Customization**: Eye radius and padding options for fine-tuned appearance
6. **Cleaner Look**: Lower error correction level results in fewer dots/squares, making the QR code look less "messy"

## Logo Requirements

- **Location**: `/web/public/logo.png`
- **Recommended Size**: Square format (e.g., 512x512px)
- **Format**: PNG with transparency recommended
- **Logo Size**: Automatically set to 25% of QR code size

## Files Modified

1. `/web/src/components/ui/shadcn-io/qr-code/index.tsx`
2. `/web/src/components/ui/qr-download.tsx`
3. `/web/src/app/create/custom/page.tsx`
4. `/web/src/components/PaymentSuccessModal.tsx`
5. `/web/src/app/page.tsx`
6. `/web/src/app/create/simple/page.tsx`
7. `/web/src/lib/themes.ts`

## URL Optimization

To make QR codes simpler and easier to scan, payment links now use shortened parameter names:

| Old Parameter | New Parameter | Description |
|--------------|---------------|-------------|
| `primaryColor` | `pc` | Primary color |
| `backgroundColor` | `bg` | Background color |
| `textColor` | `tc` | Text color |
| `borderColor` | `bc` | Border color |
| `borderRadius` | `br` | Border radius |
| `buttonStyle` | `bs` | Button style |
| `tokenSymbol` | `ts` | Token symbol |
| `tokenAmount` | `ta` | Token amount |
| `merchantName` | `mn` | Merchant name |
| `transactionId` | `ti` | Transaction ID |
| `customTitle` | `ct` | Custom title |
| `recipientAddress` | `ra` | Recipient address |
| `showTransactionId` | `st` | Show transaction ID |
| `animation` | `an` | Animation style |
| `customThumbnail` | `th` | Thumbnail URL |

**Note**: The system supports both old and new parameter names for backward compatibility. Thumbnails are stored as Vercel Blob URLs, keeping QR codes scannable.

## Dependencies

- `react-qrcode-logo`: ^4.0.0 (already installed in package.json)
