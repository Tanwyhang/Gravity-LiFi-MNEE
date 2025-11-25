declare module 'react-fancy-qrcode' {
  import { FunctionComponent, Ref } from 'react';

  export interface QRCodeProps {
    value?: string;
    size?: number;
    margin?: number;
    logo?: string | { uri: string } | any;
    logoSize?: number;
    backgroundColor?: string;
    color?: string | string[];
    colorGradientDirection?: [string, string, string, string];
    positionColor?: string;
    positionGradientDirection?: [string, string, string, string];
    positionRadius?: number | string | any[];
    dotScale?: number;
    dotRadius?: number | string;
    errorCorrection?: 'L' | 'M' | 'Q' | 'H';
    ref?: Ref<any>;
  }

  export interface QRCodeRef {
     toDataURL(callback: (data: string) => void): void;
     // For web, the ref might point to the SVG element directly or a wrapper that has outerHTML
     outerHTML?: string; 
  }

  const QRCode: FunctionComponent<QRCodeProps>;
  export default QRCode;
}
