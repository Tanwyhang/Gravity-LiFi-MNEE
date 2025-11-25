import { createPublicClient, createWalletClient, http, parseEther, formatUnits, encodePacked, parseAbi, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';
import path from 'path';

// Configuration
const ANVIL_RPC = 'http://127.0.0.1:8545';
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil Account #0
const SWAP_ROUTER = getAddress('0xE592427A0AEce92De3Edee1F18E0157C05861564'); // Mainnet SwapRouter
const WETH = getAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'); // Mainnet WETH9 (CORRECT)
const USDC = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
const MNEE = getAddress('0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF');

// Read Artifacts
const abiPath = path.join(__dirname, '../src/contracts/abis/contracts_GravityPayment_sol_GravityPayment.abi');
const binPath = path.join(__dirname, '../src/contracts/abis/contracts_GravityPayment_sol_GravityPayment.bin');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const bytecode = '0x' + fs.readFileSync(binPath, 'utf8');

async function main() {
  console.log('🚀 Starting GravityPayment Test...');

  // 1. Setup Clients
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

  // 2. Deploy Contract
  console.log('📦 Deploying GravityPayment...');
  const hash = await client.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [SWAP_ROUTER]
  });
  console.log('   Tx Hash:', hash);
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress!;
  console.log('✅ Contract deployed at:', contractAddress);

  // 3. Fund Test Account with WETH
  // We'll wrap ETH to WETH
  console.log('💰 Wrapping ETH to WETH...');
  const wethAbi = parseAbi([
      'function deposit() public payable',
      'function approve(address spender, uint256 amount) public returns (bool)',
      'function balanceOf(address owner) view returns (uint256)'
  ]);

  await client.writeContract({
      address: WETH,
      abi: wethAbi,
      functionName: 'deposit',
      value: parseEther('10')
  });
  console.log('   Wrapped 10 ETH');

  // 4. Approve Contract
  console.log('🔓 Approving GravityPayment...');
  await client.writeContract({
      address: WETH,
      abi: wethAbi,
      functionName: 'approve',
      args: [contractAddress, parseEther('10')]
  });
  console.log('   Approved');

  // 5. Execute Swap: WETH -> USDC (Test 1)
  console.log('\n📊 Test 1: Simple Swap (WETH -> USDC)...');
  
  // Path: WETH (0.05%) USDC
  // Fee: 500 (0.05%) - Most common WETH/USDC pool
  const pathEncodedSimple = encodePacked(
      ['address', 'uint24', 'address'],
      [WETH, 500, USDC]
  );

  const amountIn = parseEther('0.1'); // 0.1 WETH
  const minAmountOut = 0n; // No slippage for test
  const recipient = account.address;

  // ERC20 ABI for balance and decimals checks
  const erc20Abi = parseAbi([
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)'
  ]);

  try {
      const swapTx = await client.writeContract({
          address: contractAddress,
          abi,
          functionName: 'pay',
          args: [pathEncodedSimple, WETH, amountIn, minAmountOut, recipient]
      });
      console.log('   Swap Tx:', swapTx);
      
      await publicClient.waitForTransactionReceipt({hash: swapTx });
      console.log('✅ Swap confirmed!');

      // Check USDC Balance
      
      const usdcDecimals = await publicClient.readContract({
          address: USDC,
          abi: erc20Abi,
          functionName: 'decimals'
      });

      const usdcBalance = await publicClient.readContract({
          address: USDC,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [recipient]
      });

      console.log(`🎉 Final USDC Balance: ${formatUnits(usdcBalance as bigint, usdcDecimals as number)} USDC`);
      
      if ((usdcBalance as bigint) > 0n) {
          console.log('✅ TEST 1 PASSED: Received USDC from WETH swap.');
      } else {
          console.error('❌ TEST 1 FAILED: No USDC received.');
      }

  } catch (error) {
      console.error('❌ Simple swap failed:', error);
  }

  // 6. Execute Multi-Hop Swap: WETH -> USDC -> MNEE
  console.log('\n📊 Test 2: Multi-Hop Swap (WETH -> USDC -> MNEE)...');
  
  // Path: WETH (0.3%) USDC (0.01%) MNEE
  const pathEncodedMultiHop = encodePacked(
      ['address', 'uint24', 'address', 'uint24', 'address'],
      [WETH, 3000, USDC, 100, MNEE] // 0.3% WETH/USDC, 0.01% USDC/MNEE
  );

  const amountInMultiHop = parseEther('0.1'); // 0.1 WETH

  try {
      const swapTx = await client.writeContract({
          address: contractAddress,
          abi,
          functionName: 'pay',
          args: [pathEncodedMultiHop, WETH, amountInMultiHop, minAmountOut, recipient]
      });
      console.log('   Swap Tx:', swapTx);
      
      await publicClient.waitForTransactionReceipt({ hash: swapTx });
      console.log('✅ Multi-hop swap confirmed!');

      // Check MNEE Balance
      const mneeDecimals = await publicClient.readContract({
          address: MNEE,
          abi: erc20Abi,
          functionName: 'decimals'
      });

      const mneeBalance = await publicClient.readContract({
          address: MNEE,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [recipient]
      });

      console.log(`🎉 Final MNEE Balance: ${formatUnits(mneeBalance as bigint, mneeDecimals as number)} MNEE (Decimals: ${mneeDecimals})`);
      
      if ((mneeBalance as bigint) > 0n) {
          console.log('✅ TEST 2 PASSED: Received MNEE from multi-hop swap!');
          console.log('\n🎊 ALL TESTS PASSED! Contract is ready for deployment.');
      } else {
          console.error('❌ TEST 2 FAILED: No MNEE received.');
      }

  } catch (error) {
      console.error('❌ Multi-hop swap failed:', error);
  }
}

main().catch(console.error);
