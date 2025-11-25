import { createPublicClient, http, getAddress, parseAbi, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

const USDC = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
const MNEE = getAddress('0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF');
const UNISWAP_V3_FACTORY = getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984');

const FEE_TIERS = [100, 500, 3000, 10000];

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/268702a6f88b4111a031782c39503bc0')
});

// Top tokens by market cap and Uniswap V3 liquidity
const TOP_TOKENS = [
  { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
  { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18 },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
  { symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18 },
  { symbol: 'MKR', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18 },
  { symbol: 'LDO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', decimals: 18 },
  { symbol: 'CRV', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18 },
  { symbol: 'SNX', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18 },
  { symbol: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', decimals: 18 },
  { symbol: 'COMP', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18 },
  { symbol: 'BAL', address: '0xba100000625a3754423978a60c9317c58a424e3D', decimals: 18 },
  { symbol: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', decimals: 18 },
];

const factoryAbi = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)'
]);

const poolAbi = parseAbi([
  'function liquidity() view returns (uint128)'
]);

function formatLiquidity(liquidity: bigint, decimals: number = 18): string {
  const formatted = formatUnits(liquidity, decimals);
  const num = parseFloat(formatted);
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

async function checkToken(token: typeof TOP_TOKENS[0]) {
  const tokenAddress = getAddress(token.address);
  let bestPool = null;
  let maxLiquidity = 0n;

  for (const fee of FEE_TIERS) {
    try {
      const poolAddress = await publicClient.readContract({
        address: UNISWAP_V3_FACTORY,
        abi: factoryAbi,
        functionName: 'getPool',
        args: [tokenAddress, USDC, fee]
      }) as `0x${string}`;

      if (poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000') {
        const liquidity = await publicClient.readContract({
          address: poolAddress,
          abi: poolAbi,
          functionName: 'liquidity'
        }) as bigint;

        if (liquidity > maxLiquidity) {
          maxLiquidity = liquidity;
          bestPool = { fee, pool: poolAddress, liquidity };
        }
      }
    } catch (error) {
      // Pool doesn't exist for this fee tier
    }
  }

  return bestPool ? {
    ...token,
    tokenAddress,
    ...bestPool,
    formattedLiq: formatLiquidity(bestPool.liquidity, token.decimals)
  } : null;
}

async function main() {
  console.log('\n🔍 Scanning top tokens for USDC pool liquidity...\n');
  console.log('═'.repeat(100));

  const results = [];
  
  for (const token of TOP_TOKENS) {
    process.stdout.write(`  Checking ${token.symbol.padEnd(8)}... `);
    const result = await checkToken(token);
    
    if (result && result.liquidity > 0n) {
      results.push(result);
      console.log(`✅ Found pool (${(result.fee/10000).toFixed(2)}% fee, Liq: ${result.formattedLiq})`);
    } else {
      console.log(`❌ No liquid pool`);
    }
  }

  // Sort by liquidity (descending)
  results.sort((a, b) => Number(b.liquidity - a.liquidity));
  
  // Take top 10
  const top10 = results.slice(0, 10);

  console.log('\n' + '═'.repeat(100));
  console.log('🏆 TOP 10 TOKENS WITH HIGHEST USDC POOL LIQUIDITY');
  console.log('═'.repeat(100));
  console.log();
  
  console.log('┌────┬──────────┬──────────────────────────────────────────────┬──────────┬───────────────┐');
  console.log('│ #  │ Token    │ Pool Address                                 │ Fee Tier │ Liquidity     │');
  console.log('├────┼──────────┼──────────────────────────────────────────────┼──────────┼───────────────┤');
  
  top10.forEach((token, index) => {
    const rank = `${index + 1}`.padStart(2);
    const symbol = token.symbol.padEnd(8);
    const pool = token.pool;
    const fee = `${(token.fee/10000).toFixed(2)}%`.padStart(8);
    const liq = token.formattedLiq.padStart(13);
    
    console.log(`│ ${rank} │ ${symbol} │ ${pool} │ ${fee} │ ${liq} │`);
  });
  
  console.log('└────┴──────────┴──────────────────────────────────────────────┴──────────┴───────────────┘');
  
  console.log('\n✅ All these tokens can swap to MNEE via the path: Token → USDC → MNEE');
  console.log('═'.repeat(100));
  
  // Export as JSON for frontend use
  console.log('\n💾 Exporting to supported-tokens.json...\n');
  
  const exportData = top10.map(token => ({
    symbol: token.symbol,
    address: token.tokenAddress,
    decimals: token.decimals,
    usdcPoolAddress: token.pool,
    usdcPoolFee: token.fee,
    liquidity: token.liquidity.toString(),
    swapPath: {
      description: `${token.symbol} → USDC (${(token.fee/10000).toFixed(2)}%) → MNEE (0.01%)`,
      encoding: `encodePacked(['address', 'uint24', 'address', 'uint24', 'address'], [${token.symbol}, ${token.fee}, USDC, 100, MNEE])`
    }
  }));
  
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '../src/data/supported-tokens.json');
  
  // Create directory if it doesn't exist
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Saved to ${outputPath}`);
  console.log('\nYou can now import this in your frontend to show supported tokens!\n');
}

main().catch(console.error);
