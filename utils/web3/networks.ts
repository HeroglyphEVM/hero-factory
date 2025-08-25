import appConfig from "@/app.config";
import * as chains from "viem/chains";

// Mapping of chainId to RPC chain name an format followed by Envio
// export const RPC_CHAIN_NAMES: Record<number, string> = {
//   [chains.mainnet.id]: "eth",
//   [chains.sepolia.id]: "sepolia",
//   [chains.optimism.id]: "optimism",
//   [chains.optimismGoerli.id]: "420",
//   [chains.optimismSepolia.id]: "optimism-sepolia",
//   [chains.arbitrum.id]: "arbitrum",
//   [chains.arbitrumGoerli.id]: "421613",
//   [chains.arbitrumSepolia.id]: "arbitrum-sepolia",
//   [chains.polygon.id]: "polygon",
//   [chains.polygonMumbai.id]: "80001",
//   [chains.polygonAmoy.id]: "polygon-amoy",
//   [chains.astar.id]: "astar",
//   [chains.polygonZkEvm.id]: "polygon-zkevm",
//   [chains.polygonZkEvmTestnet.id]: "1442",
//   [chains.base.id]: "base",
//   [chains.baseGoerli.id]: "84531",
//   [chains.baseSepolia.id]: "base-sepolia",
// };

// export const getEnvioRpcUrl = (chainId: number) => {
//   const name = RPC_CHAIN_NAMES[chainId];
//   if (!name) return undefined;

//   const urlBase = `https://${name}.rpc.hypersync.xyz`;
//   const envioToken = appConfig.hypersyncBearerToken;

//   return envioToken ? `${urlBase}/${envioToken}` : urlBase;
// };

// ! The code below is for Alchemy, use if we need to switch back to it.

export const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.mainnet.id]: "eth-mainnet",
  [chains.goerli.id]: "eth-goerli",
  [chains.sepolia.id]: "eth-sepolia",
  [chains.optimism.id]: "opt-mainnet",
  [chains.optimismGoerli.id]: "opt-goerli",
  [chains.optimismSepolia.id]: "opt-sepolia",
  [chains.arbitrum.id]: "arb-mainnet",
  [chains.arbitrumGoerli.id]: "arb-goerli",
  [chains.arbitrumSepolia.id]: "arb-sepolia",
  [chains.polygon.id]: "polygon-mainnet",
  [chains.polygonMumbai.id]: "polygon-mumbai",
  [chains.polygonAmoy.id]: "polygon-amoy",
  [chains.astar.id]: "astar-mainnet",
  [chains.polygonZkEvm.id]: "polygonzkevm-mainnet",
  [chains.polygonZkEvmTestnet.id]: "polygonzkevm-testnet",
  [chains.base.id]: "base-mainnet",
  [chains.baseGoerli.id]: "base-goerli",
  [chains.baseSepolia.id]: "base-sepolia",
};

export const getRpcHttpUrl = (chainId: number) => {
  return RPC_CHAIN_NAMES[chainId]
    ? `https://${RPC_CHAIN_NAMES[chainId]}.g.alchemy.com/v2/${appConfig.alchemyApiKey}`
    : undefined;
};

export function getBlockExplorerTxLink(txnHash: string) {
  const targetChain = appConfig.targetNetwork;
  const blockExplorerTxURL = targetChain?.blockExplorers?.default?.url;
  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}
