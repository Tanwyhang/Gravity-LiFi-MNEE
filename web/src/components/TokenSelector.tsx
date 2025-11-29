import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Address } from 'viem';
import { Search, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getTokens, ChainId } from '@lifi/sdk';

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  logoURI?: string;
  chainId: number;
  priceUSD?: string;
  decimals: number;
}

interface TokenSelectorProps {
  selectedToken?: Token;
  onSelect: (token: Token) => void;
  className?: string;
}

export function TokenSelector({ selectedToken, onSelect, className }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const result = await getTokens({
          chains: [ChainId.ETH, ChainId.OPT, ChainId.ARB, ChainId.BAS, ChainId.POL], // Add more chains as needed
        });
        
        const allTokens: Token[] = [];
        Object.values(result.tokens).forEach((chainTokens) => {
          allTokens.push(...chainTokens.map(t => ({
            address: t.address as Address,
            symbol: t.symbol,
            name: t.name,
            logoURI: t.logoURI,
            chainId: t.chainId,
            priceUSD: t.priceUSD,
            decimals: t.decimals,
          })));
        });

        // Sort by priority (e.g. balance or popularity) - for now just popular ones first
        // We can also filter out spam tokens if needed
        setTokens(allTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Filter tokens based on search
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens.slice(0, 100); // Limit initial view

    const query = searchQuery.toLowerCase();
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query)
    );
  }, [searchQuery, tokens]);

  const handleValueChange = (value: string) => {
    // Value format: "chainId:address" to ensure uniqueness
    const [chainIdStr, address] = value.split(':');
    const chainId = parseInt(chainIdStr);
    const token = tokens.find(t => t.address === address && t.chainId === chainId);
    if (token) {
      onSelect(token);
      setIsOpen(false);
    }
  };

  return (
    <Select
      value={selectedToken ? `${selectedToken.chainId}:${selectedToken.address}` : undefined}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select token...">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.logoURI && (
                <Image src={selectedToken.logoURI} alt={selectedToken.symbol} width={20} height={20} className="rounded-full" unoptimized />
              )}
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-xs text-muted-foreground bg-secondary px-1 rounded">
                {getChainName(selectedToken.chainId)}
              </span>
            </div>
          ) : (
            "Select token..."
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-96 w-[300px]">
        {/* Search Input */}
        <div className="p-3 sticky top-0 bg-background border-b z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {filteredTokens.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <SelectItem
                  key={`${token.chainId}:${token.address}`}
                  value={`${token.chainId}:${token.address}`}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {token.logoURI ? (
                        <Image src={token.logoURI} alt={token.symbol} width={24} height={24} className="rounded-full" unoptimized />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                          {token.symbol[0]}
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <span className="font-medium truncate">{token.symbol}</span>
                        <span className="text-xs text-muted-foreground truncate">{token.name}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap bg-secondary/50 px-1.5 py-0.5 rounded">
                      {getChainName(token.chainId)}
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

function getChainName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum';
    case 10: return 'Optimism';
    case 42161: return 'Arbitrum';
    case 137: return 'Polygon';
    case 8453: return 'Base';
    default: return `Chain ${chainId}`;
  }
}
