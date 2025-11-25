# LiFi Integration Guide for Gravity


---

## Environment-Setup

- **API Key**: Stored in `.env` file as `LIFI_API_KEY`
- **Integrator**: `Gravity`
- **MNEE Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

## Reference Files

You may refer to these example files for SDK implementation patterns:
- `web/examples/bridge.ts`
- `web/examples/multihop.ts`
- `web/examples/swap.ts`

# Request Routes/Quotes

> Prior to executing any swap or bridging, you need to request the best route from our smart routing API..

The LI.FI SDK provides functionality to request routes and quotes, as well as to execute them. This guide will walk you through the process of making a request using `getRoutes` and `getQuote` functions.

## How to request Routes

To get started, here is a simple example of how to request routes to bridge and swap 10 USDC on Arbitrum to the maximum amount of DAI on Optimism.

```typescript  theme={"system"}
import { getRoutes } from '@lifi/sdk';

const routesRequest: RoutesRequest = {
  fromChainId: 42161, // Arbitrum
  toChainId: 10, // Optimism
  fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
};

const result = await getRoutes(routesRequest);
const routes = result.routes;
```

When you request routes, you receive an array of route objects containing the essential information to determine which route to take for a swap or bridging transfer. At this stage, transaction data is not included and must be requested separately. Read more in the **Execute Routes/Quotes** section below.

Additionally, if you would like to receive just one best option that our smart routing API can offer, it might be better to request a quote using `getQuote`.

## Routes request parameters

The `getRoutes` function expects a `RoutesRequest` object, which specifies a desired *any-to-any* transfer and includes all the information needed to calculate the most efficient routes.

### Parameters

Below are the parameters for the `RoutesRequest` interface along with their descriptions:

| Parameter          | Type         | Required | Description                                                                                                                                      |
| ------------------ | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fromChainId`      | number       | yes      | The ID of the source chain (e.g., Ethereum mainnet is 1).                                                                                        |
| `fromTokenAddress` | string       | yes      | The contract address of the token on the source chain. Ensure this address corresponds to the specified `fromChainId`.                           |
| `fromAmount`       | string       | yes      | The amount to be transferred from the source chain, specified in the smallest unit of the token (e.g., wei for ETH).                             |
| `fromAddress`      | string       | no       | The address from which the tokens are being transferred.                                                                                         |
| `toChainId`        | number       | yes      | The ID of the destination chain (e.g., Optimism is 10).                                                                                          |
| `toTokenAddress`   | string       | yes      | The contract address of the token on the destination chain. Ensure this address corresponds to the specified `toChainId`.                        |
| `toAddress`        | string       | no       | The address to which the tokens will be sent on the destination chain once the transaction is completed.                                         |
| `fromAmountForGas` | string       | no       | Part of the LI.Fuel. Allows receiving a part of the bridged tokens as gas on the destination chain. Specified in the smallest unit of the token. |
| `options`          | RouteOptions | no       | Additional options for customizing the route. This is defined by the RouteOptions interface (detailed below, see Route Options).                 |

## Route Options

The `RouteOptions` interface allows for further customization of the route request. Below are the parameters for the `RouteOptions` interface along with their descriptions:

| Parameter              | Type            | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `integrator`           | string          | no       | The identifier of the integrator, usually the dApp or company name. Ideally, this should be specified when configuring the SDK, but it can also be modified during a request                                                                                                                                                                                                                                                               |
| `fee`                  | number          | no       | The integrator fee percentage (e.g., 0.03 represents a 3% fee). This requires the integrator to be verified.                                                                                                                                                                                                                                                                                                                               |
| `maxPriceImpact`       | number          | no       | Hides routes with a price impact greater than or equal to this value. (e.g., 0.3 represents 30%)                                                                                                                                                                                                                                                                                                                                           |
| `order`                | string          | no       | `CHEAPEST` - This sorting option prioritises routes with the highest estimated return amount. Users who value capital efficiency at the expense of speed and route complexity should choose the cheapest routes. `FASTEST` - This sorting option prioritizes routes with the shortest estimated execution time. Users who value speed and want their transactions to be completed as quickly as possible should choose the fastest routes. |
| `slippage`             | number          | no       | The slippage tolerance, expressed as a decimal proportion (e.g., 0.005 represents 0.5%).                                                                                                                                                                                                                                                                                                                                                   |
| `referrer`             | string          | no       | The wallet address of the referrer, for tracking purposes.                                                                                                                                                                                                                                                                                                                                                                                 |
| `allowSwitchChain`     | boolean         | no       | Specifies whether to return routes that require chain switches (2-step routes).                                                                                                                                                                                                                                                                                                                                                            |
| `allowDestinationCall` | boolean         | no       | Specifies whether destination calls are enabled.                                                                                                                                                                                                                                                                                                                                                                                           |
| `bridges`              | AllowDenyPrefer | no       | An `AllowDenyPrefer` object to specify preferences for bridges.                                                                                                                                                                                                                                                                                                                                                                            |
| `exchanges`            | AllowDenyPrefer | no       | An `AllowDenyPrefer` object to specify preferences for exchanges.                                                                                                                                                                                                                                                                                                                                                                          |
| `timing`               | Timing          | no       | A Timing object to specify preferences for Timing Strategies.                                                                                                                                                                                                                                                                                                                                                                              |

## Allow/Deny/Prefer

The `AllowDenyPrefer` interface is used to specify preferences for bridges or exchanges. Using the `allow` option, you can allow tools, and only those tools will be used to find the best routes. Tools specified in `deny` will be blocklisted.

You can find all available keys in [List: Chains, Bridges, DEX Aggregators, Solvers](https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers) or get the available option from the API. See [Chains and Tools](https://docs.li.fi/integrate-li.fi-sdk/chains-and-tools).

Below are the parameters for the `AllowDenyPrefer` interface:

| Parameter | Type      | Required | Description                                                                               |
| --------- | --------- | -------- | ----------------------------------------------------------------------------------------- |
| `allow`   | string\[] | no       | A list of allowed bridges or exchanges (default: all).                                    |
| `deny`    | string\[] | no       | A list of denied bridges or exchanges (default: none).                                    |
| `prefer`  | string\[] | no       | A list of preferred bridges or exchanges (e.g., \['1inch'] to prefer 1inch if available). |

## Timing

The `Timing` interface allows you to specify preferences for the timing of route execution. This can help optimize the performance of your requests based on timing strategies.

Parameters for the `Timing` interface:

| Parameter                  | Type              | Required | Description                                                                                                                                                                                     |
| -------------------------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `swapStepTimingStrategies` | TimingStrategy\[] | no       | An array of timing strategies specifically for each swap step in the route. This allows you to define custom strategies for timing control during the execution of individual swap steps.       |
| `routeTimingStrategies`    | TimingStrategy\[] | no       | An array of timing strategies that apply to the entire route. This enables you to set preferences for how routes are timed overall, potentially improving execution efficiency and reliability. |

## Timing Strategy

This can help optimize the timing of requests based on specific conditions.

| Parameter                 | Type   | Required | Description                                                                                                                                                                                          |
| ------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strategy`                | string |          | The strategy type, which must be set to 'minWaitTime'. This indicates that the timing strategy being applied is based on a minimum wait time.                                                        |
| `minWaitTimeMs`           | number |          | The minimum wait time in milliseconds before any results are returned. This value ensures that the request waits for a specified duration to allow for more accurate results.                        |
| `startingExpectedResults` | number |          | The initial number of expected results that should be returned after the minimum wait time has elapsed. This helps in managing user expectations regarding the outcomes of the request.              |
| `reduceEveryMs`           | number |          | The interval in milliseconds at which the expected results are reduced as the wait time progresses. This parameter allows for dynamic adjustments to the expected results based on the elapsed time. |

<Note>
  You can implement [custom timing strategies](https://docs.li.fi/li.fi-api/li.fi-api/requesting-a-quote/optimizing-quote-response-timing) to improve the user experience and optimize the performance of your application by controlling the timing of route execution.
</Note>

## Request a Quote

When you request a quote, our smart routing API provides the best available option. The quote includes all necessary information and transaction data required to initiate a swap or bridging transfer.

Here is a simple example of how to request a quote to bridge and swap 10 USDC on Arbitrum to the maximum amount of DAI on Optimism.

```typescript  theme={"system"}
import { getQuote } from '@lifi/sdk';

const quoteRequest: QuoteRequest = {
  fromChain: 42161, // Arbitrum
  toChain: 10, // Optimism
  fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
  // The address from which the tokens are being transferred.
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0', 
};

const quote = await getQuote(quoteRequest);
```

## Quote request parameters

The `getQuotes` function expects a `QuoteRequest` object. `RoutesRequest` and `QuoteRequest` have some similarities and slight differences, and below, you can find a description of the `QuoteRequest` interface's parameters.

| Parameter          | Type   | Required | Description                                                                                                                                      |
| ------------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fromChain`        | number | yes      | The ID of the source chain (e.g., Ethereum mainnet is 1).                                                                                        |
| `fromToken`        | string | yes      | The contract address of the token on the source chain. Ensure this address corresponds to the specified `fromChain`.                             |
| `fromAmount`       | string | yes      | The amount to be transferred from the source chain, specified in the smallest unit of the token (e.g., wei for ETH).                             |
| `fromAddress`      | string | yes      | The address from which the tokens are being transferred.                                                                                         |
| `toChain`          | number | yes      | The ID of the destination chain (e.g., Optimism is 10).                                                                                          |
| `toToken`          | string | yes      | The contract address of the token on the destination chain. Ensure this address corresponds to the specified `toChain`.                          |
| `toAddress`        | string | no       | The address to which the tokens will be sent on the destination chain once the transaction is completed.                                         |
| `fromAmountForGas` | string | no       | Part of the LI.Fuel. Allows receiving a part of the bridged tokens as gas on the destination chain. Specified in the smallest unit of the token. |

### Other Quote parameters

In addition to the parameters mentioned above, all parameters listed in the **Route Options** section above are also available when using `getQuote`, except for `allowSwitchChain`, which is used exclusively to control chain switching in route requests.

Also, parameters to specify options for allowing, denying, or preferring certain bridges and exchanges have slightly different names:

* `allowBridges` (string\[], optional)

* `denyBridges` (string\[], optional)

* `preferBridges` (string\[], optional)

* `allowExchanges` (string\[], optional)

* `denyExchanges` (string\[], optional)

* `preferExchanges` (string\[], optional)

Additionally, you can specify [timing strategies](https://docs.li.fi/li.fi-api/li.fi-api/requesting-a-quote/optimizing-quote-response-timing#parameters-overview) for the swap steps using the `swapStepTimingStrategies` parameter:

* **`swapStepTimingStrategies`** (string\[], optional) Specifies the timing strategy for swap steps. This parameter allows you to define how long the request should wait for results and manage expected outcomes. The format is:

```typescript  theme={"system"}
minWaitTime-${minWaitTimeMs}-${startingExpectedResults}-${reduceEveryMs}
```

## Request contract call Quote

Besides requesting general quotes, the LI.FI SDK also provides functionality to request quotes for destination contract calls.

Read more about LI.FI Composer in the official documentation for advanced contract interaction patterns.

Here is a simple example of how to request a quote to bridge and purchase an NFT on the OpenSea marketplace costing 0.0000085 ETH on the Base chain using ETH from Optimism. The call data for this example was obtained using the OpenSea Seaport SDK.

```typescript  theme={"system"}
import { getContractCallsQuote } from '@lifi/sdk';

const contractCallsQuoteRequest = {
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
  fromChain: 10,
  fromToken: '0x0000000000000000000000000000000000000000',
  toAmount: '8500000000000',
  toChain: 8453,
  toToken: '0x0000000000000000000000000000000000000000',
  contractCalls: [
    {
      fromAmount: '8500000000000',
      fromTokenAddress: '0x0000000000000000000000000000000000000000',
      toContractAddress: '0x0000000000000068F116a894984e2DB1123eB395',
      toContractCallData:
        '0xe7acab24000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000006e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed700000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000520000000000000000000000000000000000000000000000000000000000000064000000000000000000000000090884b5bd9f774ed96f941be2fb95d56a029c99c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066757dd300000000000000000000000000000000000000000000000000000000669d0a580000000000000000000000000000000000000000000000000000000000000000360c6ebe0000000000000000000000000000000000000000ad0303de3e1093e50000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000029f25e8a71e52e795e5016edf7c9e02a08c519b40000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006ff0cbadd00000000000000000000000000000000000000000000000000000006ff0cbadd0000000000000000000000000090884b5bd9f774ed96f941be2fb95d56a029c99c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003179fcad000000000000000000000000000000000000000000000000000000003179fcad000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a88c37e000000000000000000000000000000000000000000000000000000008a88c37e000000000000000000000000009323bb21a4c6122f60713e4a1e38e7b94a40ce2900000000000000000000000000000000000000000000000000000000000000e3b5b41791fe051471fa3c2da1325a8147c833ad9a6609ffc07a37e2603de3111b262911aaf25ed6d131dd531574cf54d4ea61b479f2b5aaa2dff7c210a3d4e203000000f37ec094486e9092b82287d7ae66fbf8cd6148233c70813583e3264383afbd0484b80500070135f54edd2918ddd4260c840f8a6957160766a4e4ef941517f2a0ab3077a2ac6478f0ad7fad9b821766df11ca3fdb16a8e95782faaed6e0395df2f416651ac87a5c1edec0a36ad42555083e57cff59f4ad98617a48a3664b2f19d46f4db85e95271c747d03194b5cfdcfc86bb0b08fb2bc4936d6f75be03ab498d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      toContractGasLimit: '210000',
    },
  ],
};

const contractCallQuote = await getContractCallsQuote(contractCallsQuoteRequest);
```

## Contract call Quote request parameters

The `getContractCallsQuote` function expects a `ContractCallsQuoteRequest` object, which includes all the information needed to request a quote for a destination contract call.

Contract call quote request can be treated as an extension to the quote request and in addition to the parameters mentioned below, all parameters listed in the [Other Quote parameters](https://docs.li.fi/integrate-li.fi-sdk/request-routes-quotes#other-quote-parameters) section (such as `integrator`, `fee`, `slippage`, etc.) are also available when using `getContractCallsQuote`.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
|           |      |          |             |

Array of contract call objects.

| Parameter              | Type   | Required | Description                                                                                                                |
| ---------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `fromAmount`           | string | yes      | The amount of tokens to be sent to the contract. This amount is independent of any previously bridged or deposited tokens. |
| `fromTokenAddress`     | string | yes      | The address of the token to be sent to the contract. For example, an ETH staking transaction would require ETH.            |
| `toContractAddress`    | string | yes      | The address of the contract to interact with on the destination chain.                                                     |
| `toContractCallData`   | string | yes      | The call data to be sent to the contract for the interaction on the destination chain.                                     |
| `toContractGasLimit`   | string | yes      | The estimated gas required for the contract call. Incorrect values may cause the interaction to fail.                      |
| `toApprovalAddress`    | string | no       | The address to approve the token transfer if it is different from the contract address.                                    |
| `contractOutputsToken` | string | no       | The address of the token that will be output by the contract, if applicable (e.g., staking ETH produces stETH).            |

## Difference between `Route` and `Quote`

Even though `Route` and `Quote` terms lie in the same field of providing you with the best option to make a swap or bridging transfer, there are some differences you need to be aware of.

A `Route` in LI.FI represents a detailed transfer plan that may include *multiple steps*. Each step corresponds to an individual transaction, such as swapping tokens or bridging funds between chains. These steps must be executed in a specific sequence, as each one depends on the output of the previous step. A `Route` provides a detailed pathway for complex transfers involving multiple actions.

In contrast, a `Quote` is a *single-step* transaction. It contains all the necessary information to perform a transfer in one go, without requiring any additional steps. `Quotes` are used for simpler transactions where a single action, such as a token swap or a cross-chain transfer, is sufficient. Thus, while `Routes` can involve multiple steps to complete a transfer, a `Quote` always represents just one step.

# Execute Routes/Quotes

> We allow you to execute any on-chain or cross-chain swap and bridging transfer and a combination of both.

The LI.FI SDK offers functionality to execute routes and quotes. In this guide, you'll learn how to utilize the SDK's features to handle complex cross-chain transfers, manage execution settings, and control the transaction flow.

## Execute route

Let's say you have obtained the route. Refer to [Request Routes/Quotes](https://docs.li.fi/integrate-li.fi-sdk/request-routes-quotes) for more details.

Please make sure you've configured SDK with EVM/Solana providers. Refer to [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers) for more details.

Now, to execute the route, we can use the `executeRoute` function. Here is a simplified example of how to use it:

```typescript  theme={"system"}
import { executeRoute, getRoutes } from '@lifi/sdk'

const result = await getRoutes({
  fromChainId: 42161, // Arbitrum
  toChainId: 10, // Optimism
  fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
  // The address from which the tokens are being transferred.
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0', 
})

const route = result.routes[0]

const executedRoute = await executeRoute(route, {
  // Gets called once the route object gets new updates
  updateRouteHook(route) {
    console.log(route)
  },
})
```

The `executeRoute` function internally manages allowance and balance checks, chain switching, transaction data retrieval, transactions submission, and transactions status tracking.

* **Parameters:**

  * `route` (`Route`): The route to be executed.

  * `executionOptions` (`ExecutionOptions`, optional): An object containing settings and callbacks for execution.
* **Returns:**

  * `Promise<RouteExtended>`: Resolves when execution is done or halted and rejects when it is failed.

### Execution Options

All execution options are optional, but we recommend reviewing their descriptions to determine which ones may be beneficial for your use case.

Certain options, such as [acceptExchangeRateUpdateHook](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#acceptexchangerateupdatehook), can be crucial for successfully completing a transfer if the exchange rate changes during the process.

#### `updateRouteHook`

The function is called when the route object changes during execution. This function allows you to handle route updates, track execution status, transaction hashes, etc. See [Monitor route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#monitor-route-execution) section for more details.

* **Parameters**:

  * `updatedRoute` (`RouteExtended`): The updated route object.

#### `updateTransactionRequestHook`

The function is intended for advanced usage, and it allows you to modify swap/bridge transaction requests or token approval requests before they are sent, e.g., updating gas information.

* **Parameters**:

  * `updatedTxRequest` (`TransactionRequestParameters`): The transaction request parameters need to be updated.
* **Returns**: `Promise<TransactionParameters>`: The modified transaction parameters.

#### `acceptExchangeRateUpdateHook`

This function is called whenever the exchange rate changes during a swap or bridge operation. It provides you with the old and new amount values. To continue the execution, you should return `true`. If this hook is not provided or if you return `false`, the SDK will throw an error. This hook is an ideal place to prompt your users to accept the new exchange rate.

* **Parameters**:

  * `toToken` (`Token`): The destination token.

  * `oldToAmount` (`string`): The previous amount of the target token.

  * `newToAmount` (`string`): The new amount of the target token.

* **Returns**: `Promise<boolean | undefined>`: Whether the update is accepted.

* **Throws:** `TransactionError: Exchange rate has changed!`

#### `switchChainHook`

* **Parameters**:

  * `chainId` (`number`): The ID of the chain to which to switch.
* **Returns**: `Promise<WalletClient | undefined>`: The new wallet client after switching chains.

#### `executeInBackground`

A boolean flag indicating whether the route execution should continue in the background without requiring user interaction. See [Update route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#update-route-execution) and [Resume route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#resume-route-execution) sections for details on how to utilize this option.

* **Type**: `boolean`

* **Default**: `false`

#### `disableMessageSigning`

A boolean flag indicating whether to disable message signing during execution. Certain operations require signing EIP-712 messages, including Permit approvals (ERC-2612) and gasless transactions. This functionality may not be compatible with all smart accounts or wallets, in which case this flag should be set to true to disable message signing.

* **Type**: `boolean`

* **Default**: `false`

## Manage route execution

After starting route execution, there might be use cases when you need to adjust execution settings, stop execution and come back later, or move execution to the background. We provide several functions to achieve that.

### Update route execution

The `updateRouteExecution` function is used to update the settings of an ongoing route execution.

One common use case is to push the execution to the background, for example, when a user navigates away from the execution page in your dApp. When this function is called, the execution will continue until it requires user interaction (e.g., signing a transaction or switching the chain). At that point, the execution will halt, and the `executeRoute` promise will be resolved.

To move the execution back to the foreground and make it active again, you can call `resumeRoute` with the same route object. The execution will then resume from where it was halted.

```typescript  theme={"system"}
import { updateRouteExecution } from '@lifi/sdk'

updateRouteExecution(route, { executeInBackground: true });
```

* **Parameters:**

  * `route` (`Route`): The active route to be updated.

  * `executionOptions` (`ExecutionOptions`, **required**): An object containing settings and callbacks for execution.

### Resume route execution

The `resumeRoute` function is used to resume a halted, aborted, or failed route execution from the point where it stopped. It is crucial to call `resumeRoute` with the latest active route object returned from the `executeRoute` function or the most recent version of the updated route object from the `updateRouteHook`.

#### Common Use Cases

* **Move Execution to Foreground**: When a user navigates back to the execution page in your dApp, you can call this function to move the execution back to the foreground. The execution will resume from where it was halted.

* **Page Refresh**: If the user refreshes the page in the middle of the execution process, calling this function will attempt to resume the execution.

* **User Interaction Errors**: If the user rejects a chain switch, declines to sign a transaction, or encounters any other error, you can call this function to attempt to resume the execution.

```typescript  theme={"system"}
import { resumeRoute } from '@lifi/sdk'

const route = await resumeRoute(route, { executeInBackground: false });
```

* **Parameters:**

  * `route` (`Route`): The route to be resumed to execution.

  * `executionOptions` (`ExecutionOptions`, optional): An object containing settings and callbacks for execution.
* **Returns:**

  * `Promise<RouteExtended>`: Resolves when execution is done or halted and rejects when it is failed.

### Stop route execution

The `stopRouteExecution` function is used to stop the ongoing execution of an active route. It stops any remaining user interaction within the ongoing execution and removes the route from the execution queue. However, if a transaction has already been signed and sent by the user, it will be executed on-chain.

```typescript  theme={"system"}
import { stopRouteExecution } from '@lifi/sdk'

const stoppedRoute = stopRouteExecution(route);
```

* **Parameters:**

  * `route` (`Route`): The route that is currently being executed and needs to be stopped.
* **Returns:**

  * `Route`: The route object that was stopped.

## Monitor route execution

Monitoring route execution is important and we provide tools for tracking progress, receiving data updates, accessing transaction hashes, and explorer links.

### Brief description of steps

A `route` object includes multiple `step` objects, each representing a set of transactions that should be completed in the specified order. Each step can include multiple transactions that require a signature, such as an allowance transaction followed by the main swap or bridge transaction. Read more [LI.FI Terminology](https://docs.li.fi/overview/li.fi-terminology).

### Understanding the `execution` object

Each `step` within a `route` has an `execution` object. This object contains all the necessary information to track the execution progress of that step. The `execution` object has a `process` array where each entry represents a sequential stage in the execution. The latest process entry contains the most recent information about the execution stage.

### Process array

The `process` array within the `execution` object details each step’s progression. Each `process` object has a type and status and might also include a transaction hash and a link to a blockchain explorer after the user signs the transaction.

### Tracking progress

To monitor the execution progress, you leverage the `updateRouteHook` callback and iterate through the route steps, checking their `execution` objects. Look at the `process` array to get the latest information about the execution stage. The most recent entry in the `process` array will contain the latest transaction hash, status, and other relevant details.

### Example to access transaction hashes

```typescript  theme={"system"}
const getTransactionLinks = (route: RouteExtended) => {
  route.steps.forEach((step, index) => {
    step.execution?.process.forEach((process) => {
      if (process.txHash) {
        console.log(
          `Transaction Hash for Step ${index + 1}, Process ${process.type}:`,
          process.txHash
        )
      }
    })
  })
}

const executedRoute = await executeRoute(route, {
  updateRouteHook(route) {
    getTransactionLinks(route)
  },
})
```

### Get active routes

To get routes that are currently being executed (active), you can use `getActiveRoutes` and `getActiveRoute` functions.

```typescript  theme={"system"}
import { getActiveRoute, getActiveRoutes, RouteExtended } from '@lifi/sdk'

const activeRoutes: RouteExtended[] = getActiveRoutes();

const routeId = activeRoutes[0].routeId;

const activeRoute = getActiveRoute(routeId);
```

## Execute quote

To execute a quote using the `executeRoute`, you need to convert it to a route object first. We provide `convertQuoteToRoute` helper function to transform quote objects to route objects. This applies to both standard and contract call quotes.

```typescript  theme={"system"}
import { convertQuoteToRoute, executeRoute, getQuote } from '@lifi/sdk';

const quoteRequest: QuoteRequest = {
  fromChain: 42161, // Arbitrum
  toChain: 10, // Optimism
  fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
  // The address from which the tokens are being transferred.
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0', 
};

const quote = await getQuote(quoteRequest);

const route = convertQuoteToRoute(quote)

const executedRoute = await executeRoute(route, {
  // Gets called once the route object gets new updates
  updateRouteHook(route) {
    console.log(route)
  },
})
```

## Manual route execution

In addition to using the `executeRoute` function, you can execute routes and quotes manually. This approach requires developers to handle the logic for obtaining transaction data, switching chains, sending transactions, and tracking transaction status independently.

Initially, when route objects are requested, they do not include transaction data. This is because multiple route options are provided, and generating transaction data for all options would substantially delay the response. Each route consists of multiple steps, and once a user selects a route, transaction data for each step should be requested individually using the `getStepTransaction` function (see example below). Each step should be executed sequentially, as each step depends on the outcome of the previous one.

On the other hand, quote objects are returned with transaction data included, so the `getStepTransaction` call is not necessary, and they can be executed immediately.

After sending a transaction using the obtained transaction data, you can track the status of the transaction using the `getStatus` function. This function helps you monitor the progress and completion of each transaction. Read more [Status of a Transaction](https://docs.li.fi/li.fi-api/li.fi-api/status-of-a-transaction).

Here's a simplified example. For the sake of simplicity, this example omits balance checks, transaction replacements, error handling, chain switching, etc. However, in a real implementation, you should include these additional functionalities to have a robust solution and ensure reliability.

```typescript  theme={"system"}
import { getStepTransaction, getStatus } from '@lifi/sdk';

// Simplified example function to execute each step of the route sequentially
async function executeRouteSteps(route) {
  for (const step of route.steps) {
    // Request transaction data for the current step
    const step = await getStepTransaction(step);
    
    // Send the transaction (e.g. using Viem)
    const transactionHash = await sendTransaction(step.transactionRequest);
    
    // Monitor the status of the transaction
    let status;
    do {
      const result = await getStatus({
        txHash: transactionHash,
        fromChain: step.action.fromChainId,
        toChain: step.action.toChainId,
        bridge: step.tool,
      })
      status = result.status
      
      console.log(`Transaction status for ${transactionHash}:`, status);
      
      // Wait for a short period before checking the status again
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } while (status !== 'DONE' && status !== 'FAILED');
    
    if (status === 'FAILED') {
      console.error(`Transaction ${transactionHash} failed`);
      return;
    }
  }
  
  console.log('All steps executed successfully');
}
```

#### `getStepTransaction`

* **Parameters:**

  * `step` (`LiFiStep`): The step object for which we need to get transaction data.

  * `options` (`RequestOptions`, optional): An object containing request options, such as `AbortSignal`, which can be used to cancel the request if necessary.
* **Returns:**

  * `Promise<LiFiStep>`: A promise that resolves to the step object containing the transaction data.

#### `getStatus`

* **Parameters:**

  * `params` (`GetStatusRequest`): The parameters for checking the status include the transaction hash, source and destination chain IDs, and the DEX or bridge name.

  * `options` (`RequestOptions`, optional): An object containing request options, such as `AbortSignal`, which can be used to cancel the request if necessary.
* **Returns:**

  * `Promise<StatusResponse>`: A promise that resolves to a status response containing all relevant information about the transfer.


# Chains and Tools

> Request all available chains, bridges, and exchanges.

Get an overview of which options (chains, bridges, DEXs) are available at this moment.

## Get available chains

### `getChains`

Fetches a list of all available chains supported by the SDK.

**Parameters**

* `params` (ChainsRequest, optional): Configuration for the requested chains.

  * `chainTypes` (ChainType\[], optional): List of chain types.
* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to an array of `ExtendedChain` objects.

```typescript Example theme={"system"}
import { ChainType, getChains } from '@lifi/sdk';

try {
  const chains = await getChains({ chainTypes: [ChainType.EVM] });
  console.log(chains);
} catch (error) {
  console.error(error);
}
```

## Get available bridges and DEXs

### `getTools`

Fetches the tools available for bridging and swapping tokens.

**Parameters**

* `params` (ToolsRequest, optional): Configuration for the requested tools.

  * `chains` ((ChainKey | ChainId)\[], optional): List of chain IDs or keys.
* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to `ToolsResponse` and contains information about available bridges and DEXs.

```typescript Example theme={"system"}
import { getTools } from '@lifi/sdk';

try {
  const tools = await getTools();
  console.log(tools);
} catch (error) {
  console.error(error);
}
```

## Get available connections

A connection is a pair of two tokens (on the same chain or on different chains) that can be exchanged via our platform.

Read more [Getting all possible Connections](https://docs.li.fi/li.fi-api/li.fi-api/getting-all-possible-connections)

### `getConnections`

Gets all the available connections for swapping or bridging tokens.

**Parameters**

* `connectionRequest` (ConnectionsRequest): Configuration of the connection request.

  * `fromChain` (number, optional): The source chain ID.

  * `fromToken` (string, optional): The source token address.

  * `toChain` (number, optional): The destination chain ID.

  * `toToken` (string, optional): The destination token address.

  * `allowBridges` (string\[], optional): Allowed bridges.

  * `denyBridges` (string\[], optional): Denied bridges.

  * `preferBridges` (string\[], optional): Preferred bridges.

  * `allowExchanges` (string\[], optional): Allowed exchanges.

  * `denyExchanges` (string\[], optional): Denied exchanges.

  * `preferExchanges` (string\[], optional): Preferred exchanges.

  * `allowSwitchChain` (boolean, optional): Whether connections that require chain switch (multiple signatures) are included. Default is true.

  * `allowDestinationCall` (boolean, optional): Whether connections that include destination calls are included. Default is true.

  * `chainTypes` (ChainType\[], optional): Types of chains to include.
* `options` (RequestOptions, optional): Request options.

**Returns**

A Promise that resolves to a `ConnectionsResponse`.

```typescript Example theme={"system"}
import { getConnections } from '@lifi/sdk';

const connectionRequest = {
  fromChain: 1,
  fromToken: '0x0000000000000000000000000000000000000000',
  toChain: 10,
  toToken: '0x0000000000000000000000000000000000000000',
};

try {
  const connections = await getConnections(connectionRequest);
  console.log('Connections:', connections);
} catch (error) {
  console.error('Error:', error);
}
```

For more detailed information on each endpoint and their responses, please refer to the [LI.FI API](https://docs.li.fi/li.fi-api/li.fi-api) documentation.


# Token Management

> Request all available tokens and their balances, manage token approvals and more.

## Get available tokens

### `getTokens`

Retrieves a list of all available tokens on specified chains.

**Parameters**

* `params` (TokensRequest, optional): Configuration for the requested tokens.

  * `chains` (ChainId\[], optional): List of chain IDs or keys. If not specified, returns tokens on all available chains.

  * `chainTypes` (ChainType\[], optional): List of chain types.
* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to `TokensResponse`

```typescript Example theme={"system"}
import { ChainType, getTokens } from '@lifi/sdk';

try {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });
  console.log(tokens);
} catch (error) {
  console.error(error);
}
```

### `getToken`

Fetches details about a specific token on a specified chain.

**Parameters**

* `chain` (ChainKey | ChainId): ID or key of the chain that contains the token.

* `token` (string): Address or symbol of the token on the requested chain.

* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to `Token` object.

```typescript Example theme={"system"}
import { getToken } from '@lifi/sdk';

const chainId = 1;
const tokenAddress = '0x0000000000000000000000000000000000000000';

try {
  const token = await getToken(chainId, tokenAddress);
  console.log(token);
} catch (error) {
  console.error(error);
}
```

## Get token balance

Please ensure that you configure the SDK with EVM/Solana providers first. They are required to use this functionality. Additionally, it is recommended to provide your private RPC URLs, as public ones are used by default and may rate limit you for multiple requests, such as getting the balance of multiple tokens at once.

Read more [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers).

### `getTokenBalance`

Returns the balance of a specific token a wallet holds.

**Parameters**

* `walletAddress` (string): A wallet address.

* `token` (Token): A Token object.

**Returns**

A Promise that resolves to a `TokenAmount` or `null`.

```typescript Example theme={"system"}
import { getToken, getTokenBalance } from '@lifi/sdk';

const chainId = 1;
const tokenAddress = '0x0000000000000000000000000000000000000000';
const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';

try {
  const token = await getToken(chainId, tokenAddress);
  const tokenBalance = await getTokenBalance(walletAddress, token);
  console.log(tokenBalance);
} catch (error) {
  console.error(error);
}
```

### `getTokenBalances`

Returns the balances for a list of tokens a wallet holds.

**Parameters**

* `walletAddress` (string): A wallet address.

* `tokens` (Token\[]): A list of Token objects.

**Returns**

A Promise that resolves to a list of `TokenAmount` objects.

```typescript Example theme={"system"}
import { ChainId, getTokenBalances, getTokens } from '@lifi/sdk';

const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';

try {
  const tokensResponse = await getTokens();
  const optimismTokens = tokensResponse.tokens[ChainId.OPT];
  const tokenBalances = await getTokenBalances(walletAddress, optimismTokens);
  console.log(tokenBalances);
} catch (error) {
  console.error(error);
}
```

### `getTokenBalancesByChain`

Queries the balances of tokens for a specific list of chains for a given wallet.

**Parameters**

* `walletAddress` (string): A wallet address.

* `tokensByChain` \[chainId: number]: Token\[]: A list of Token objects organized by chain IDs.

**Returns**

A Promise that resolves to an object containing the tokens and their amounts on different chains.

```typescript Example theme={"system"}
import { getTokenBalancesByChain } from '@lifi/sdk';

const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const tokensByChain = {
  1: [
    {
      chainId: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18,
      priceUSD: '0.9999',
    },
  ],
  10: [
    {
      chainId: 10,
      address: '0x4200000000000000000000000000000000000042',
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      priceUSD: '1.9644',
    },
  ],
};

try {
  const balances = await getTokenBalancesByChain(walletAddress, tokensByChain);
  console.log(balances);
} catch (error) {
  console.error(error);
}
```

## Managing token allowance

Token allowance and approval functionalities are specific to EVM (Ethereum Virtual Machine) chains. It allows smart contracts to interact with ERC-20 tokens by approving a certain amount of tokens that a contract can spend from the user's wallet.

Please ensure that you configure the SDK with the EVM provider. It is required to use this functionality.

Read more [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers).

### `getTokenAllowance`

Fetches the current allowance for a specific token.

**Parameters**

* `token` (BaseToken): The token for which to check the allowance.

* `ownerAddress` (string): The owner of the token.

* `spenderAddress` (string): The spender address that was approved.

**Returns**

A Promise that resolves to a `bigint` representing the allowance or undefined if the token is a native token.

```typescript Example theme={"system"}
import { getTokenAllowance } from '@lifi/sdk';

const token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 1,
};

const ownerAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const spenderAddress = '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE';

try {
  const allowance = await getTokenAllowance(token, ownerAddress, spenderAddress);
  console.log('Allowance:', allowance);
} catch (error) {
  console.error('Error:', error);
}
```

### `getTokenAllowanceMulticall`

Fetches the current allowance for a list of token/spender address pairs.

**Parameters**

* `ownerAddress` (string): The owner of the tokens.

* `tokens` (TokenSpender\[]): A list of token and spender address pairs.

**Returns**

A Promise that resolves to an array of `TokenAllowance` objects.

```typescript Example theme={"system"}
import { getTokenAllowanceMulticall } from '@lifi/sdk';

const ownerAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const tokens = [
  {
    token: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: 1,
    },
    spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  },
  {
    token: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      chainId: 1,
    },
    spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  },
];

try {
  const allowances = await getTokenAllowanceMulticall(ownerAddress, tokens);
  console.log('Allowances:', allowances);
} catch (error) {
  console.error('Error:', error);
}
```

### `setTokenAllowance`

Sets the token allowance for a specific token and spender address.

**Parameters**

* `request` (ApproveTokenRequest): The approval request.

  * `walletClient` (WalletClient): The wallet client used to send the transaction.

  * `token` (BaseToken): The token for which to set the allowance.

  * `spenderAddress` (string): The address of the spender.

  * `amount` (bigint): The amount of tokens to approve.

  * `infiniteApproval` (boolean, optional): If true, sets the approval to the maximum uint256 value.

**Returns**

A Promise that resolves to a `Hash` representing the transaction hash or `void` if no transaction is needed (e.g., for native tokens).

```typescript Example theme={"system"}
import { setTokenAllowance } from '@lifi/sdk';

const approvalRequest = {
  walletClient: walletClient, // Viem wallet client
  token: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
  },
  spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  amount: 100000000n,
};

try {
  const txHash = await setTokenAllowance(approvalRequest);
  console.log('Transaction Hash:', txHash);
} catch (error) {
  console.error('Error:', error);
}
```

### `revokeTokenApproval`

Revokes the token approval for a specific token and spender address.

**Parameters**

* `request` (RevokeApprovalRequest): The revoke request.

  * `walletClient` (WalletClient): The wallet client used to send the transaction.

  * `token` (BaseToken): The token for which to revoke the allowance.

  * `spenderAddress` (string): The address of the spender.

**Returns**

A Promise that resolves to a `Hash` representing the transaction hash or `void` if no transaction is needed (e.g., for native tokens).

```typescript Example theme={"system"}
import { revokeTokenApproval } from '@lifi/sdk';

const revokeRequest = {
  walletClient: walletClient, // Viem wallet client
  token: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
  },
  spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
};

try {
  const txHash = await revokeTokenApproval(revokeRequest);
  console.log('Transaction Hash:', txHash);
} catch (error) {
  console.error('Error:', error);
}
```



# Testing Integration

> Run test transactions on mainnets.

Testing your integration is crucial to ensure everything functions correctly before going live. We no longer support testnets and advise running test transactions on mainnets because bridges and exchanges have limited testnet support and minimal liquidity.

**Recommendations:**
- Use chains with low gas fees (Optimism and other L2s are excellent choices)
- Test with small amounts first
- Validate both SDK and API integration patterns

Make sure you've completed the SDK configuration and route/quote request setup before testing.

---

# Quick Reference: API vs SDK

## Direct API Usage

Generate quotes using the `/quote` endpoint:

```TypeScript
const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
    const result = await axios.get('https://li.quest/v1/quote', {
        params: { fromChain, toChain, fromToken, toToken, fromAmount, fromAddress }
    });
    return result.data;
}
```

## Quote vs Route Summary

- **`/quote`**: Returns best single-step route with transaction data included
- **`/advanced/routes`**: Supports complex multi-step routes, requires separate `/stepTransaction` calls
- Use `allowChainSwitch: false` to get single-step routes from `/advanced/routes`



# End-to-end Transaction Example

## Step by step

<Steps>
  <Step title="Requesting a quote or routes">
    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
          const result = await axios.get('https://li.quest/v1/quote', {
              params: {
                  fromChain,
                  toChain,
                  fromToken,
                  toToken,
                  fromAmount,
                  fromAddress,
              }
          });
          return result.data;
      }

      const fromChain = 'DAI';
      const fromToken = 'USDC';
      const toChain = 'POL';
      const toToken = 'USDC';
      const fromAmount = '1000000';
      const fromAddress = YOUR_WALLET_ADDRESS;

      const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
      ```
    </CodeGroup>
  </Step>

  <Step title="Choose the desired route if `/advanced/routes` was used and retrieve transaction data from `/advanced/stepTransaction`">
    <Note>
      This step is only needed if `/advanced/routes` endpoint was used. `/quote` already returns the transaction data within the response. The difference between `/quote` and `/advanced/routes` is described in the **Quote vs Route** section above.
    </Note>
  </Step>

  <Step title="Setting the allowance">
    Before any transaction can be sent, it must be made sure that the user is allowed to send the requested amount from the wallet.

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const { Contract } = require('ethers');

      const ERC20_ABI = [
          {
              "name": "approve",
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "spender",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                  }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "name": "allowance",
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "owner",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "spender",
                      "type": "address"
                  }
              ],
              "outputs": [
                  {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                  }
              ],
              "stateMutability": "view",
              "type": "function"
          }
      ];

      // Get the current allowance and update it if needed
      const checkAndSetAllowance = async (wallet, tokenAddress, approvalAddress, amount) => {
          // Transactions with the native token don't need approval
          if (tokenAddress === ethers.constants.AddressZero) {
              return
          }

          const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet);
          const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);

          if (allowance.lt(amount)) {
              const approveTx = await erc20.approve(approvalAddress, amount);
              await approveTx.wait();
          }
      }

      await checkAndSetAllowance(wallet, quote.action.fromToken.address, quote.estimate.approvalAddress, fromAmount);
      ```
    </CodeGroup>
  </Step>

  <Step title="Sending the transaction">
    After receiving a quote, the transaction has to be sent to trigger the transfer.

    Firstly, the wallet has to be configured. The following example connects your wallet to the Gnosis Chain.

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/', 100);
      const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
          provider
      );
      ```
    </CodeGroup>

    Afterward, the transaction can be sent using the `transactionRequest` inside the previously retrieved quote:

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const tx = await wallet.sendTransaction(quote.transactionRequest);
      await tx.wait();
      ```
    </CodeGroup>
  </Step>

  <Step title="Executing second step if applicable">
    If two-step route was used, the second step has to be executed after the first step is complete. Fetch the status of the first step like described in next step and then request transactionData from the `/advanced/stepTransaction` endpoint.
  </Step>

  <Step title="Fetching the transfer status">
    To check if the token was successfully sent to the receiving chain, the /status endpoint can be called:

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const getStatus = async (bridge, fromChain, toChain, txHash) => {
          const result = await axios.get('https://li.quest/v1/status', {
              params: {
                  bridge,
                  fromChain,
                  toChain,
                  txHash,
              }
          });
          return result.data;
      }

      result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
      ```
    </CodeGroup>
  </Step>
</Steps>

## Full example

<CodeGroup>
  ```ts TypeScript theme={"system"}
  const ethers = require('ethers');
  const axios = require('axios');

  const API_URL = 'https://li.quest/v1';

  // Get a quote for your desired transfer
  const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
      const result = await axios.get(`${API_URL}/quote`, {
          params: {
              fromChain,
              toChain,
              fromToken,
              toToken,
              fromAmount,
              fromAddress,
          }
      });
      return result.data;
  }

  // Check the status of your transfer
  const getStatus = async (bridge, fromChain, toChain, txHash) => {
      const result = await axios.get(`${API_URL}/status`, {
          params: {
              bridge,
              fromChain,
              toChain,
              txHash,
          }
      });
      return result.data;
  }

  const fromChain = 'DAI';
  const fromToken = 'USDC';
  const toChain = 'POL';
  const toToken = 'USDC';
  const fromAmount = '1000000';
  const fromAddress = YOUR_WALLET_ADDRESS;

  // Set up your wallet
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/', 100);
  const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
      provider
  );

  const run = async () => {
      const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
      const tx = await wallet.sendTransaction(quote.transactionRequest);

      await tx.wait();

      // Only needed for cross chain transfers
      if (fromChain !== toChain) {
          let result;
          do {
              result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
          } while (result.status !== 'DONE' && result.status !== 'FAILED')
      }
  }

  run().then(() => {
      console.log('DONE!')
  });
  ```
</CodeGroup>
