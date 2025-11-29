'use client';

import { formatHex, oklch } from 'culori';
import QRCode from 'react-fancy-qrcode';
import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data: string;
  foreground?: string;
  background?: string;
  robustness?: 'L' | 'M' | 'Q' | 'H';
  size?: number;
  logo?: string | { uri: string };
  logoSize?: number;
  dotScale?: number;
  dotRadius?: number | string;
  positionRadius?: number | string | any[];
  positionColor?: string;
  colorGradientDirection?: [string, string, string, string];
  positionGradientDirection?: [string, string, string, string];
};

const oklchRegex = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/;

const getOklch = (color: string, fallback: [number, number, number]) => {
  const oklchMatch = color.match(oklchRegex);

  if (!oklchMatch) {
    return { l: fallback[0], c: fallback[1], h: fallback[2] };
  }

  return {
    l: Number.parseFloat(oklchMatch[1]),
    c: Number.parseFloat(oklchMatch[2]),
    h: Number.parseFloat(oklchMatch[3]),
  };
};

export const QRCodeComponent = ({
  data,
  foreground,
  background,
  robustness = 'L',
  size: initialSize = 100,
  className,
  logoSize,
  dotScale = 0.7,
  dotRadius = 2,
  positionRadius = 4,
  positionColor,
  colorGradientDirection,
  positionGradientDirection,
  ...props
}: QRCodeProps) => {
  const [colors, setColors] = useState({ fg: '#000000', bg: '#ffffff' });
  const [size, setSize] = useState(initialSize);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolveColors = () => {
      try {
        const styles = getComputedStyle(document.documentElement);
        const foregroundColor =
          foreground ?? styles.getPropertyValue('--foreground');
        const backgroundColor =
          background ?? styles.getPropertyValue('--background');

        const foregroundOklch = getOklch(
          foregroundColor,
          [0.21, 0.006, 285.885]
        );
        const backgroundOklch = getOklch(backgroundColor, [0.985, 0, 0]);

        setColors({
          fg: formatHex(oklch({ mode: 'oklch', ...foregroundOklch })) || '#000000',
          bg: formatHex(oklch({ mode: 'oklch', ...backgroundOklch })) || '#ffffff',
        });
      } catch (err) {
        console.error(err);
      }
    };

    resolveColors();
  }, [foreground, background]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        // Only update size if it's significantly different to avoid loops/jitters
        // and ensure we have a valid width
        if (width > 0 && Math.abs(width - size) > 5) {
             setSize(width);
        }
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [size]);

  if (!data) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn('size-full flex items-center justify-center', className)}
      {...props}
    >
      <QRCode
        value={data}
        size={size}
        backgroundColor={colors.bg}
        color={colors.fg}
        errorCorrection={robustness}
        logoSize={logoSize}
        dotScale={dotScale}
        dotRadius={dotRadius}
        positionRadius={positionRadius}
        positionColor={positionColor}
        colorGradientDirection={colorGradientDirection}
        positionGradientDirection={positionGradientDirection}
      />
    </div>
  );
};

// Export as QRCode to maintain compatibility with imports
export { QRCodeComponent as QRCode };
