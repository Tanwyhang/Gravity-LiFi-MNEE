import { useState, useEffect } from 'react';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';
import { getQuote, executeRoute, Route, getToken, convertQuoteToRoute } from '@lifi/sdk';
import { Address, parseUnits, formatUnits } from 'viem';
import { MNEE_TOKEN_ADDRESS } from '@/contracts/addresses';
import { lifiConfig } from '@/lib/lifi';

// MNEE is deployed on Ethereum Mainnet
const MNEE_CHAIN_ID = 1; // Ethereum Mainnet

export interface PaymentState {
  isApproving: boolean;
  isPaying: boolean;
  error: string | null;
  txHash: string | null;
  status: 'idle' | 'quoting' | 'ready' | 'approving' | 'paying' | 'completed' | 'failed';
}

export function useLiFiPayment(
  tokenIn: Address | undefined,
  tokenInChainId: number | undefined,
  amountUSD: string,
  recipientAddress: string
) {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  
  const [state, setState] = useState<PaymentState>({
    isApproving: false,
    isPaying: false,
    error: null,
    txHash: null,
    status: 'idle',
  });

  const [quote, setQuote] = useState<Route | null>(null);
  const [estimatedAmountIn, setEstimatedAmountIn] = useState<string>('0');

  // Fetch quote when dependencies change
  useEffect(() => {
    if (!tokenIn || !tokenInChainId || !amountUSD || !address) {
      setQuote(null);
      setState(prev => ({ ...prev, status: 'idle' }));
      return;
    }

    const fetchQuote = async () => {
      setState(prev => ({ ...prev, status: 'quoting', error: null }));
      try {
        // 1. Get Token Details to find price
        const token = await getToken(tokenInChainId, tokenIn);
        
        if (!token.priceUSD) {
          throw new Error(`Unable to fetch price for ${token.symbol}. Please try another token.`);
        }

        // 2. Calculate AmountIn based on USD value
        const priceUSD = parseFloat(token.priceUSD);
        const targetUSD = parseFloat(amountUSD);
        
        if (targetUSD <= 0) {
          throw new Error('Amount must be greater than zero');
        }

        const amountInDecimal = targetUSD / priceUSD;
        const amountInBigInt = parseUnits(amountInDecimal.toFixed(token.decimals), token.decimals);
        
        setEstimatedAmountIn(formatUnits(amountInBigInt, token.decimals));

        // 3. Get Quote from LiFi for cross-chain swap to MNEE
        const quoteRequest = {
          fromChain: tokenInChainId,
          toChain: MNEE_CHAIN_ID,
          fromToken: tokenIn,
          toToken: MNEE_TOKEN_ADDRESS,
          fromAmount: amountInBigInt.toString(),
          fromAddress: address,
          toAddress: recipientAddress || address, // Fallback to sender if no recipient
          slippage: 0.005, // 0.5% slippage tolerance
        };

        const quote = await getQuote(quoteRequest);
        const route = convertQuoteToRoute(quote);
        setQuote(route);
        setState(prev => ({ ...prev, status: 'ready' }));

      } catch (error: any) {
        console.error('Failed to get quote:', error);
        let errorMessage = 'Unable to get quote. Please try again.';
        
        // Provide more specific error messages
        if (error.message?.includes('price')) {
          errorMessage = 'Token price unavailable. Please select another token.';
        } else if (error.message?.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setState(prev => ({ ...prev, status: 'failed', error: errorMessage }));
        setQuote(null);
      }
    };

    fetchQuote();
  }, [tokenIn, tokenInChainId, amountUSD, address, recipientAddress]);

  const pay = async () => {
    if (!quote || !walletClient || !address) return;

    setState(prev => ({ ...prev, status: 'paying', isPaying: true, error: null }));

    try {
      // Switch chain if necessary
      if (chain?.id !== tokenInChainId) {
        await switchChainAsync({ chainId: tokenInChainId! });
      }

      // Execute the route with proper signer configuration
      const route = await executeRoute(quote, {
        updateRouteHook: (updatedRoute) => {
          console.log('Route updated:', updatedRoute);
          // Update the quote state with the progress
          setQuote(updatedRoute);
        },
        acceptExchangeRateUpdateHook: async (params) => {
          // Auto-accept minor rate changes (< 2% difference)
          const oldAmount = parseFloat(params.oldToAmount);
          const newAmount = parseFloat(params.newToAmount);
          const percentChange = Math.abs((newAmount - oldAmount) / oldAmount);
          return percentChange < 0.02;
        },
      });

      const lastStep = route.steps[route.steps.length - 1];
      const txHash = lastStep.execution?.process.find(p => p.type === 'CROSS_CHAIN' || p.type === 'SWAP')?.txHash;

      setState(prev => ({
        ...prev,
        status: 'completed',
        isPaying: false,
        txHash: txHash || null,
      }));
    } catch (error: any) {
      console.error('Payment failed:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      // Specific error handling
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for this transaction';
      } else if (error.message?.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try a smaller amount.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        status: 'failed',
        isPaying: false,
        error: errorMessage,
      }));
    }
  };

  return {
    pay,
    state,
    quote,
    estimatedAmountIn,
  };
}
