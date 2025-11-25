import { createPublicClient, createWalletClient, http, parseUnits, formatUnits, encodePacked, parseAbi, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

// Configuration
const ANVIL_RPC = 'http://127.0.0.1:8545';
const PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const SWAP_ROUTER = getAddress('0xE592427A0AEce92De3Edee1F18E0157C05861564');
const WETH = getAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
const USDC = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
const MNEE = getAddress('0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF');

// Popular ERC20 tokens on Mainnet with their typical fee tiers and whale addresses
const POPULAR_TOKENS = [
  { 
    symbol: 'WETH', 
    address: WETH, 
    decimals: 18, 
    feeToUSDC: 3000,
    whale: null // We can wrap ETH directly
  },
  { 
    symbol: 'USDC', 
    address: USDC, 
    decimals: 6, 
    feeToUSDC: 0, // Direct
    whale: getAddress('0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503') // Binance hot wallet
  },
  { 
    symbol: 'DAI', 
    address: getAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'), 
    decimals: 18, 
    feeToUSDC: 500,
    whale: getAddress('0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf') // Polygon Bridge
  },
  { 
    symbol: 'USDT', 
    address: getAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'), 
    decimals: 6, 
    feeToUSDC: 500,
    whale: getAddress('0x5041ed759Dd4aFc3a72b8192C143F72f4724081A') // Large holder
  },
  { 
    symbol: 'WBTC', 
    address: getAddress('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'), 
    decimals: 8, 
    feeToUSDC: 3000,
    whale: getAddress('0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8') // Binance
  },
  { 
    symbol: 'UNI', 
    address: getAddress('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'), 
    decimals: 18, 
    feeToUSDC: 3000,
    whale: getAddress('0x7fd805E2852113E8167c701b43EAd86364e800b9') // Uniswap V2 Router
  },
  { 
    symbol: 'LINK', 
    address: getAddress('0x514910771AF9Ca656af840dff83E8264EcF986CA'), 
    decimals: 18, 
    feeToUSDC: 3000,
    whale: getAddress('0x98C63b7B319dFBDF3d811530F2ab9DfE4983Af9D') // Large holder
  },
  { 
    symbol: 'AAVE', 
    address: getAddress('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'), 
    decimals: 18, 
    feeToUSDC: 3000,
    whale: getAddress('0x373704e394EF150241aeE836115d78Aba3FC5c76') // Large AAVE holder
  },
];

// Read Artifacts
const abiPath = path.join(__dirname, '../src/contracts/abis/contracts_GravityPayment_sol_GravityPayment.abi');
const binPath = path.join(__dirname, '../src/contracts/abis/contracts_GravityPayment_sol_GravityPayment.bin');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const bytecode = '0x' + fs.readFileSync(binPath, 'utf8');

async function main() {
  console.log('🎮 Interactive GravityPayment Multi-Token Swap Tester\n');

  const account = privateKeyToAccount(PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(ANVIL_RPC)
  });
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(ANVIL_RPC)
  });

  // Deploy Contract
  console.log('📦 Deploying GravityPayment...');
  const hash = await client.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [SWAP_ROUTER]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress!;
  console.log(`✅ Contract deployed at: ${contractAddress}\n`);

  const wethAbi = parseAbi([
    'function deposit() public payable',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function balanceOf(address owner) view returns (uint256)'
  ]);

  const erc20Abi = parseAbi([
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ]);

  const rl = readline.createInterface({ input, output });

  while (true) {
    console.log('\n' + '='.repeat(60));
    console.log('Available Tokens to Test:');
    console.log('='.repeat(60));
    
    POPULAR_TOKENS.forEach((token, index) => {
      console.log(`${index + 1}. ${token.symbol.padEnd(8)} (${token.address})`);
    });
    console.log(`${POPULAR_TOKENS.length + 1}. Exit\n`);

    const choice = await rl.question('Select a token to swap (enter number): ');
    const tokenIndex = parseInt(choice) - 1;

    if (tokenIndex === POPULAR_TOKENS.length) {
      console.log('👋 Goodbye!');
      rl.close();
      break;
    }

    if (tokenIndex < 0 || tokenIndex >= POPULAR_TOKENS.length) {
      console.log('❌ Invalid choice. Try again.');
      continue;
    }

    const selectedToken = POPULAR_TOKENS[tokenIndex];
    console.log(`\n🎯 Testing swap: ${selectedToken.symbol} → USDC → MNEE`);

    try {
      const amount = await rl.question(`\nEnter amount of ${selectedToken.symbol} to swap (e.g., 0.1): `);
      const parsedAmount = parseUnits(amount, selectedToken.decimals);

      // Get tokens
      if (selectedToken.symbol === 'WETH') {
        // Wrap ETH to get WETH
        console.log(`\n💰 Wrapping ${amount} ETH to WETH...`);
        await client.writeContract({
          address: WETH,
          abi: wethAbi,
          functionName: 'deposit',
          value: parsedAmount
        });
        console.log('   ✅ Wrapped');
      } else if (selectedToken.whale) {
        // Use whale impersonation to get tokens
        console.log(`\n🐋 Getting ${amount} ${selectedToken.symbol} from whale address...`);
        console.log(`   Whale: ${selectedToken.whale}`);
        
        // Impersonate the whale account
        await publicClient.request({
          method: 'anvil_impersonateAccount' as any,
          params: [selectedToken.whale]
        });
        
        // Create a client for the whale
        const whaleClient = createWalletClient({
          account: selectedToken.whale,
          chain: mainnet,
          transport: http(ANVIL_RPC)
        });
        
        // Transfer tokens from whale to test account
        await whaleClient.writeContract({
          address: selectedToken.address,
          abi: parseAbi(['function transfer(address to, uint256 amount) returns (bool)']),
          functionName: 'transfer',
          args: [account.address, parsedAmount]
        });
        
        // Stop impersonating
        await publicClient.request({
          method: 'anvil_stopImpersonatingAccount' as any,
          params: [selectedToken.whale]
        });
        
        console.log('   ✅ Tokens received from whale');
      }

      console.log(`🔓 Approving GravityPayment...`);
      await client.writeContract({
        address: selectedToken.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, parsedAmount]
      });
      console.log('   ✅ Approved');

      // Build path
      let pathEncoded: `0x${string}`;
      if (selectedToken.symbol === 'USDC') {
        // Direct USDC -> MNEE
        pathEncoded = encodePacked(
          ['address', 'uint24', 'address'],
          [USDC, 100, MNEE]
        );
      } else {
        // Token -> USDC -> MNEE
        pathEncoded = encodePacked(
          ['address', 'uint24', 'address', 'uint24', 'address'],
          [selectedToken.address, selectedToken.feeToUSDC, USDC, 100, MNEE]
        );
      }

      console.log(`🔄 Executing swap via GravityPayment...`);
      
      // Get balance before swap
      const mneeBalanceBefore = await publicClient.readContract({
        address: MNEE,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account.address]
      }) as bigint;
      
      const swapTx = await client.writeContract({
        address: contractAddress,
        abi,
        functionName: 'pay',
        args: [pathEncoded, selectedToken.address, parsedAmount, 0n, account.address]
      });

      await publicClient.waitForTransactionReceipt({ hash: swapTx });
      console.log('   ✅ Swap confirmed!');

      // Check MNEE balance after swap
      const mneeDecimals = await publicClient.readContract({
        address: MNEE,
        abi: erc20Abi,
        functionName: 'decimals'
      }) as number;

      const mneeBalanceAfter = await publicClient.readContract({
        address: MNEE,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account.address]
      }) as bigint;

      const mneeReceived = mneeBalanceAfter - mneeBalanceBefore;
      
      console.log(`\n📊 Swap Results:`);
      console.log(`   Amount In: ${amount} ${selectedToken.symbol}`);
      console.log(`   Amount Received: ${formatUnits(mneeReceived, mneeDecimals)} MNEE`);
      console.log(`   Total MNEE Balance: ${formatUnits(mneeBalanceAfter, mneeDecimals)} MNEE`);
      console.log(`   Transaction: ${swapTx}`);
      
      // Price analysis
      const pricePerToken = Number(formatUnits(mneeReceived, mneeDecimals)) / parseFloat(amount);
      console.log(`\n💰 Effective Rate: ${pricePerToken.toFixed(4)} MNEE per ${selectedToken.symbol}`);

    } catch (error: any) {
      console.error(`\n❌ Swap failed: ${error.message || error}`);
    }
  }
}

main().catch(console.error);
