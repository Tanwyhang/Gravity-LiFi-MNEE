import { createConfig, EVM } from '@lifi/sdk';
import { getWalletClient, switchChain } from '@wagmi/core';
import { config as wagmiConfig } from '@/config/wagmi';

// Initialize LiFi SDK with configuration
export const lifiConfig = createConfig({
  integrator: 'Gravity',
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId) => {
        const chain = await switchChain(wagmiConfig, { chainId: chainId as any });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    }),
  ],
});
