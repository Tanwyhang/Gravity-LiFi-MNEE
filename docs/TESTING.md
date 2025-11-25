# Testing GravityPayment Contract

Since you don't have a full Hardhat/Foundry project setup, we've created a standalone test script that uses `viem` and a local **Anvil** fork of Mainnet.

## Prerequisites

1.  **Foundry (Anvil)**: You need to have Foundry installed.
    *   If not installed, run: `curl -L https://foundry.paradigm.xyz | bash` then `foundryup`.
2.  **Node.js Dependencies**: Ensure `web` dependencies are installed.
    *   Run `cd web && npm install` if you haven't.

## Step 1: Start Anvil Mainnet Fork

Open a terminal and run the following command to fork Mainnet. This creates a local blockchain that mimics the state of Mainnet (including Uniswap pools) but runs locally on your machine.

```bash
# Replace with your RPC URL if needed
anvil --fork-url https://mainnet.infura.io/v3/268702a6f88b4111a031782c39503bc0 --chain-id 1
```

Keep this terminal **open**. You should see output indicating it's listening on `127.0.0.1:8545`.

## Step 2: Run the Test Script

Open a **second terminal** and run the test script. This script will:
1.  Deploy your `GravityPayment.sol` contract to the local fork.
2.  Wrap some ETH to WETH.
3.  Approve the contract.
4.  Execute a swap (WETH -> USDC -> MNEE) using the contract.
5.  Verify the MNEE balance.
================================================================
```bash
# Run from the root directory
npx tsx web/scripts/test-swap.ts
```

## Expected Output

If successful, you should see:
```
🚀 Starting GravityPayment Test...
📦 Deploying GravityPayment...
   Tx Hash: 0x...
✅ Contract deployed at: 0x...
💰 Wrapping ETH to WETH...
   Wrapped 10 ETH
🔓 Approving GravityPayment...
   Approved
🔄 Executing Swap (WETH -> USDC -> MNEE)...
   Swap Tx: 0x...
✅ Swap confirmed!
🎉 Final MNEE Balance: 1234.5678... (Decimals: 6)
✅ TEST PASSED: Received MNEE tokens.
```

## Troubleshooting

*   **"command not found: anvil"**: Install Foundry (see Prerequisites).
*   **"Error: Connection refused"**: Make sure Anvil is running in the other terminal.
*   **"Swap failed"**: Ensure the forked RPC URL is valid and has access to Mainnet state.
