import { createPublicClient, createWalletClient, http, parseEther, formatUnits, encodePacked, parseAbi, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Configuration
const ANVIL_RPC = 'http://127.0.0.1:8545';
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil Account #0
const SWAP_ROUTER = getAddress('0xE592427A0AEce92De3Edee1F18E0157C05861564'); // Mainnet SwapRouter
const WETH = getAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'); // Mainnet WETH9
const USDC = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');

async function main() {
  console.log('🔬 Testing Direct SwapRouter Call...');

  // Setup Clients
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

  // Wrap ETH to WETH
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
      value: parseEther('1')
  });
  console.log('   Wrapped 1 ETH');

  // Approve SwapRouter
  console.log('🔓 Approving SwapRouter...');
  await client.writeContract({
      address: WETH,
      abi: wethAbi,
      functionName: 'approve',
      args: [SWAP_ROUTER, parseEther('1')]
  });
  console.log('   Approved');

  // Call SwapRouter directly
  console.log('🔄 Calling SwapRouter.exactInput directly...');
  
  const swapRouterAbi = parseAbi([
      'struct ExactInputParams { bytes path; address recipient; uint256 deadline; uint256 amountIn; uint256 amountOutMinimum; }',
      'function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut)'
  ]);

  const pathEncoded = encodePacked(
      ['address', 'uint24', 'address'],
      [WETH, 3000, USDC] // 0.3% fee tier
  );

  const amountIn = parseEther('0.1');
  const recipient = account.address;

  try {
      const swapTx = await client.writeContract({
          address: SWAP_ROUTER,
          abi: swapRouterAbi,
          functionName: 'exactInput',
          args: [{
              path: pathEncoded,
              recipient: recipient,
              deadline: BigInt(Math.floor(Date.now() / 1000) + 300),
              amountIn: amountIn,
              amountOutMinimum: 0n
          }]
      });
      console.log('   Swap Tx:', swapTx);
      
      await publicClient.waitForTransactionReceipt({ hash: swapTx });
      console.log('✅ Direct swap successful!');

      // Check USDC Balance
      const erc20Abi = parseAbi([
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)'
      ]);
      
      const usdcBalance = await publicClient.readContract({
          address: USDC,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [recipient]
      });

      console.log(`🎉 USDC Balance: ${formatUnits(usdcBalance as bigint, 6)} USDC`);

  } catch (error: any) {
      console.error('❌ Direct swap failed:', error.message || error);
  }
}

main().catch(console.error);
