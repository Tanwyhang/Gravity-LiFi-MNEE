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
