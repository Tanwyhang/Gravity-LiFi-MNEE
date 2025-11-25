export interface PaymentTheme {
  name: string;
  id: string;
  config: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
    buttonStyle?: 'solid' | 'gradient' | 'outline' | 'glow';
    tokenSymbol?: string;
    tokenAmount?: string;
    merchantName?: string;
    transactionId?: string;
    customTitle?: string;
    recipientAddress?: string;
    showTransactionId?: boolean;
    animation?: 'none' | 'pulse' | 'bounce' | 'glow';
    customThumbnail?: string;
  };
}

export const paymentThemes: PaymentTheme[] = [
  {
    name: 'WALRUS',
    id: 'walrus',
    config: {
      primaryColor: '#243370',
      backgroundColor: '#d6fffa',
      textColor: '#000000',
      borderColor: '#030303',
      borderRadius: 17,
      buttonStyle: 'solid',
      tokenSymbol: 'ETH',
      tokenAmount: '0.05',
      merchantName: 'GRAVITY_PAY',
      transactionId: '#DEMO123',
      customTitle: 'PAY_WITH_CRYPTO',
      recipientAddress: '0x0ce3580766DcdDAf281DcCE968885A989E9B0e99',
      showTransactionId: true,
      animation: 'pulse',
          customThumbnail: undefined
    }
  },
  {
    name: 'Gravity Demo Theme',
    id: 'gravity-demo',
    config: {
      primaryColor: '#243370',
      backgroundColor: '#d6fffa',
      textColor: '#000000',
      borderColor: '#030303',
      borderRadius: 17,
      buttonStyle: 'solid',
      tokenSymbol: 'ETH',
      tokenAmount: '0.05',
      merchantName: 'GRAVITY_PAY',
      transactionId: '#DEMO123',
      customTitle: 'PAY_WITH_CRYPTO',
      recipientAddress: '0x0ce3580766DcdDAf281DcCE968885A989E9B0e99',
      showTransactionId: true,
      animation: 'pulse',
          customThumbnail: undefined
    }
  },
  {
    name: 'Dark Professional',
    id: 'dark-pro',
    config: {
      primaryColor: '#6366f1',
      backgroundColor: '#09090b',
      textColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderRadius: 12,
      buttonStyle: 'gradient',
      tokenSymbol: 'USDC',
      tokenAmount: '124.50',
      merchantName: 'Professional Service',
      customTitle: 'Payment Required',
      showTransactionId: false,
      animation: 'none'
    }
  },
  {
    name: 'Light Minimal',
    id: 'light-minimal',
    config: {
      primaryColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#d1d5db',
      borderRadius: 8,
      buttonStyle: 'outline',
      tokenSymbol: 'USDC',
      tokenAmount: '50.00',
      merchantName: 'Minimal Store',
      customTitle: 'Complete Payment',
      showTransactionId: false,
      animation: 'none'
    }
  },
  {
    name: 'Neon Glow',
    id: 'neon-glow',
    config: {
      primaryColor: '#a855f7',
      backgroundColor: '#1a1a2e',
      textColor: '#f0f9ff',
      borderColor: '#7c3aed',
      borderRadius: 16,
      buttonStyle: 'glow',
      tokenSymbol: 'USDT',
      tokenAmount: '250.00',
      merchantName: 'CYBER_SHOP',
      transactionId: 'CSH-2024-001',
      customTitle: 'SECURE_PAYMENT',
      showTransactionId: true,
      animation: 'glow'
    }
  }
];

export function getThemeById(id: string): PaymentTheme | undefined {
  return paymentThemes.find(theme => theme.id === id);
}

export function getThemeConfigById(id: string) {
  const theme = getThemeById(id);
  return theme?.config;
}

// Generate URL with theme parameters
export function generatePaymentUrl(basePath: string, eventId: string, theme: PaymentTheme, amountUSD: string): string {
  const params = new URLSearchParams();

  // Add all theme config parameters
  Object.entries(theme.config).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        params.set(key, value.toString());
      } else {
        params.set(key, value.toString());
      }
    }
  });

  // Add amount
  if (amountUSD) {
    params.set('usdAmount', amountUSD);
  }

  return `${basePath}/${eventId}?${params.toString()}`;
}

// Parse URL parameters into theme config
export function parseUrlThemeParams(searchParams: URLSearchParams): Partial<PaymentTheme['config']> {
  const config: Partial<PaymentTheme['config']> = {};

  // Map URL parameters to config keys - supports both short (new) and long (backward compatibility) names
  const paramMapping: Record<string, keyof PaymentTheme['config']> = {
    // Short names (new, reduce QR complexity)
    pc: 'primaryColor',
    bg: 'backgroundColor',
    tc: 'textColor',
    bc: 'borderColor',
    br: 'borderRadius',
    bs: 'buttonStyle',
    ts: 'tokenSymbol',
    ta: 'tokenAmount',
    mn: 'merchantName',
    ti: 'transactionId',
    ct: 'customTitle',
    ra: 'recipientAddress',
    st: 'showTransactionId',
    an: 'animation',
    th: 'customThumbnail',
    // Long names (backward compatibility)
    primaryColor: 'primaryColor',
    backgroundColor: 'backgroundColor',
    textColor: 'textColor',
    borderColor: 'borderColor',
    borderRadius: 'borderRadius',
    buttonStyle: 'buttonStyle',
    tokenSymbol: 'tokenSymbol',
    tokenAmount: 'tokenAmount',
    merchantName: 'merchantName',
    transactionId: 'transactionId',
    customTitle: 'customTitle',
    recipientAddress: 'recipientAddress',
    showTransactionId: 'showTransactionId',
    animation: 'animation',
    customThumbnail: 'customThumbnail'
  };

  Object.entries(paramMapping).forEach(([param, configKey]) => {
    const value = searchParams.get(param);
    if (value !== null && value !== undefined) {
      // Handle boolean values
      if (configKey === 'showTransactionId') {
        config[configKey] = value === 'true';
      }
      // Handle number values
      else if (configKey === 'borderRadius') {
        config[configKey] = parseInt(value, 10) || undefined;
      }
      // Handle buttonStyle with type checking
      else if (configKey === 'buttonStyle') {
        const validStyles: Array<'solid' | 'gradient' | 'outline' | 'glow'> = ['solid', 'gradient', 'outline', 'glow'];
        if (validStyles.includes(value as any)) {
          config[configKey] = value as any;
        }
      }
      // Handle animation with type checking
      else if (configKey === 'animation') {
        const validAnimations: Array<'none' | 'pulse' | 'bounce' | 'glow'> = ['none', 'pulse', 'bounce', 'glow'];
        if (validAnimations.includes(value as any)) {
          config[configKey] = value as any;
        }
      }
      // Handle string values
      else {
        config[configKey] = value;
      }
    }
  });

  return config;
}