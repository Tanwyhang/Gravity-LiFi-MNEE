import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, optimism, arbitrum, base, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Gravity Payment Links',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000',
  chains: [mainnet, optimism, arbitrum, base, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
