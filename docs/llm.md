# Universal MNEE Settlement Implementation Guide

This document outlines the technical specification for a **Universal Payment Gateway** that allows users to pay with **any ERC20 token** (ETH, WETH, DAI, USDT, etc.) and settle in **MNEE** via Uniswap V3 multi-hop routing.

---

## 1. Architecture Overview

Instead of a single-purpose `USDC->MNEE` contract, we utilize Uniswap V3's **Multi-Hop Routing**. This allows the contract to accept any token that has a liquidity path to MNEE (likely routing through USDC as a hub).

**Route Example:**
`WBTC` --(0.3%)--> `USDC` --(0.01%)--> `MNEE`

---

## 2. Smart Contract (GravityPayment)

The contract uses `ISwapRouter.exactInput` to execute multi-hop swaps encoded in a `path` parameter.

**File:** `contracts/GravityPayment.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface ISwapRouter {
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);
}

contract GravityPayment {
    ISwapRouter public immutable swapRouter;
    address public owner;

    event PaymentSettled(
        address indexed payer, 
        address indexed recipient, 
        address tokenIn, 
        uint256 amountIn, 
        uint256 amountOut, 
        uint256 timestamp
    );

    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
        owner = msg.sender;
    }

    /// @notice Swaps any token for MNEE (or any target) based on the encoded path
    /// @param path Uniswap V3 encoded path (tokenIn + fee + tokenMid + fee + tokenOut)
    /// @param tokenIn The address of the token the user is paying with
    /// @param amountIn The amount of tokenIn to spend
    /// @param minAmountOut Minimum amount of final token to receive (slippage protection)
    /// @param recipient The address to receive the settled tokens
    function pay(
        bytes calldata path,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external returns (uint256 amountOut) {
        require(amountIn > 0, "Zero amount");
        
        // 1. Transfer Input Token
        bool ok = IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        require(ok, "Transfer failed");

        // 2. Approve Router
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // 3. Execute Multi-Hop Swap
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: recipient,
            deadline: block.timestamp + 300,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut
        });

        amountOut = swapRouter.exactInput(params);

        emit PaymentSettled(msg.sender, recipient, tokenIn, amountIn, amountOut, block.timestamp);
    }
}
```

---

## 3. Frontend Integration (Pathfinding)

The complexity moves from the contract to the **Frontend**. You must construct the `path` bytes for the swap.

### A. Constructing the Path
The path is a sequence of `[tokenAddress, fee, tokenAddress, fee, tokenAddress]`.

**Example: WETH -> USDC -> MNEE**
1.  **WETH**: `0xC02aaA39b223FE8D0A087c9182418f9797a364E8`
2.  **Pool Fee 1**: `3000` (0.3%) -> `0x000BB8` (3 bytes)
3.  **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
4.  **Pool Fee 2**: `100` (0.01%) -> `0x000064` (3 bytes)
5.  **MNEE**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

**Encoding (Solidity/Ethers):**
```javascript
const path = ethers.utils.solidityPack(
  ["address", "uint24", "address", "uint24", "address"],
  [WETH_ADDRESS, 3000, USDC_ADDRESS, 100, MNEE_ADDRESS]
);
```

### B. Calling the Contract
```javascript
await gravityContract.pay(
  path,           // Encoded path
  WETH_ADDRESS,   // tokenIn
  amountIn,       // amount
  minMNEEOut,     // slippage calculated via Quoter
  recipient       // merchant address
);
```

---

## 4. Development & Testing

### Forking Mainnet
You still use Anvil to fork Mainnet, but now you can test with **any** token.

1.  **Impersonate a Whale**: Find a holder of the token you want to test (e.g., a DAI whale).
2.  **Fund Test Account**: Transfer DAI to your test user.
3.  **Execute Swap**: Run the `pay` function with a path like `DAI -> USDC -> MNEE`.

---

## 5. Deployment Parameters

**SwapRouter (Mainnet):** `0x95b2d1E30ca8241d320D36d4a84Ddf454Ee55435`

That's the only constructor argument needed for the generic contract.
