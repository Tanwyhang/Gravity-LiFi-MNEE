import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, optimism, arbitrum, base, polygon } from 'wagmi/chains';

import { createStorage, cookieStorage } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Gravity Payment Links',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000',
  chains: [mainnet, sepolia, optimism, arbitrum, base, polygon],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
