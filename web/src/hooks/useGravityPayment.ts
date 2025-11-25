import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits, erc20Abi, Address, Hex } from 'viem';
import { GRAVITY_PAYMENT_ADDRESS, MNEE_TOKEN_ADDRESS, QUOTER_ADDRESS } from '@/contracts/addresses';
import GravityPaymentABI from '@/contracts/abis/GravityPayment.json';
import QuoterV2ABI from '@/contracts/abis/QuoterV2.json';
import { findOptimalPath } from '@/lib/routeFinder';

export interface PaymentState {
  isApproving: boolean;
  isPaying: boolean;
  error: string | null;
  txHash: string | null;
  quote: string | null;
}

export function useGravityPayment(
  tokenIn: Address | undefined,
  amountInRaw: string, // User input amount (e.g. "10.5")
  eventId: string = "1", // Default event ID for now
  recipient: string | undefined // Merchant address
) {
  const { address } = useAccount();
  const [state, setState] = useState<PaymentState>({
    isApproving: false,
    isPaying: false,
    error: null,
    txHash: null,
    quote: null,
  });
  const [path, setPath] = useState<Hex | undefined>();
  const [isPathLoading, setIsPathLoading] = useState(false);
  const [minAmountOut, setMinAmountOut] = useState<bigint>(0n);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // 1. Get Decimals
  const { data: decimals } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!tokenIn },
  });

  const amountIn = decimals && amountInRaw ? parseUnits(amountInRaw, decimals) : 0n;

  // 2. Find optimal path using offchain BFS algorithm
  useEffect(() => {
    if (!tokenIn || amountIn <= 0n) {
      setPath(undefined);
      setMinAmountOut(0n);
      setState(prev => ({ ...prev, quote: null }));
      return;
    }

    let cancelled = false;
    setIsPathLoading(true);

    const fetchPathAndQuote = async () => {
      try {
        const discoveredPath = await findOptimalPath(tokenIn, MNEE_TOKEN_ADDRESS, 3);
        
        if (cancelled) return;

        if (discoveredPath) {
          setPath(discoveredPath);
          
          // Fetch Quote from QuoterV2
          if (publicClient) {
            try {
              // QuoterV2 quoteExactInput returns (amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate)
              // We use simulateContract or readContract. Quoter functions are not view, but we can static call them.
              // However, wagmi/viem readContract handles this for non-view functions if we provide the right config?
              // Actually, Quoter functions revert to return the result, or we use staticCall.
              // Viem's readContract uses eth_call.
              
              const result = await publicClient.readContract({
                address: QUOTER_ADDRESS,
                abi: QuoterV2ABI,
                functionName: 'quoteExactInput',
                args: [discoveredPath, amountIn]
              }) as [bigint, bigint[], number[], bigint];

              const amountOut = result[0];
              const formattedQuote = formatUnits(amountOut, 18); // Assuming MNEE is 18 decimals
              
              // Calculate minAmountOut with 1% slippage
              const minOut = (amountOut * 99n) / 100n;
              
              if (!cancelled) {
                setMinAmountOut(minOut);
                setState(prev => ({ ...prev, quote: formattedQuote }));
              }
            } catch (quoteError) {
              console.error('Quote failed:', quoteError);
              // Fallback to 0 slippage if quote fails (risky but allows proceeding)
              if (!cancelled) {
                setMinAmountOut(0n);
                setState(prev => ({ ...prev, quote: null }));
              }
            }
          }
        } else {
          setPath(undefined);
          setState(prev => ({ ...prev, quote: null }));
        }
      } catch (error) {
        console.error('Route discovery failed:', error);
        if (!cancelled) {
          setPath(undefined);
          setState(prev => ({ ...prev, quote: null }));
        }
      } finally {
        if (!cancelled) {
          setIsPathLoading(false);
        }
      }
    };

    fetchPathAndQuote();

    return () => {
      cancelled = true;
    };
  }, [tokenIn, amountIn, publicClient]);

  // 3. Check Allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, GRAVITY_PAYMENT_ADDRESS],
    query: { enabled: !!address && !!tokenIn },
  });

  const handlePay = async () => {
    if (!tokenIn || !amountIn || !address || !recipient) {
        setState(prev => ({ ...prev, error: "Missing payment details" }));
        return;
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      // Check Balance
      const balance = await publicClient?.readContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      });

      if (balance !== undefined && balance < amountIn) {
        throw new Error(`Insufficient balance. You have ${formatUnits(balance, decimals || 18)} but need ${formatUnits(amountIn, decimals || 18)}`);
      }

      // Check Allowance & Approve if needed
      if (allowance !== undefined && allowance < amountIn) {
        setState(prev => ({ ...prev, isApproving: true }));
        try {
            const approveTx = await writeContractAsync({
                address: tokenIn,
                abi: erc20Abi,
                functionName: 'approve',
                args: [GRAVITY_PAYMENT_ADDRESS, amountIn],
            });
            await publicClient?.waitForTransactionReceipt({ hash: approveTx });
            await refetchAllowance();
        } catch (e) {
            throw new Error('Approval failed or rejected');
        } finally {
            setState(prev => ({ ...prev, isApproving: false }));
        }
      }

      setState(prev => ({ ...prev, isPaying: true }));

      const payTx = await writeContractAsync({
        address: GRAVITY_PAYMENT_ADDRESS,
        abi: GravityPaymentABI.abi,
        functionName: 'pay',
        args: [
            path || "0x",   // Encoded path
            tokenIn,        // tokenIn
            amountIn,       // amountIn
            minAmountOut,   // minAmountOut (calculated from quote)
            recipient as Address // recipient
        ],
      });

      setState(prev => ({ ...prev, txHash: payTx }));
      await publicClient?.waitForTransactionReceipt({ hash: payTx });
      setState(prev => ({ ...prev, isPaying: false }));

    } catch (err: any) {
      console.error('❌ Payment failed:', err);
      setState(prev => ({
        ...prev,
        isApproving: false,
        isPaying: false,
        error: err.message || 'Payment failed'
      }));
    }
  };

  return {
    pay: handlePay,
    state,
    path,
    isPathLoading,
    canPay: !!tokenIn && amountIn > 0n && !state.isPaying && !state.isApproving && !!path && !!recipient
  };
}
