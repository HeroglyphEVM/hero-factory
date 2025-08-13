import appConfig from "@/app.config";
import * as chains from "viem/chains";

// Mapping of chainId to RPC chain name an format followed by Envio
export const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.mainnet.id]: "eth",
  [chains.sepolia.id]: "sepolia",
  [chains.optimism.id]: "optimism",
  [chains.optimismGoerli.id]: "420",
  [chains.optimismSepolia.id]: "optimism-sepolia",
  [chains.arbitrum.id]: "arbitrum",
  [chains.arbitrumGoerli.id]: "421613",
  [chains.arbitrumSepolia.id]: "arbitrum-sepolia",
  [chains.polygon.id]: "polygon",
  [chains.polygonMumbai.id]: "80001",
  [chains.polygonAmoy.id]: "polygon-amoy",
  [chains.astar.id]: "astar",
  [chains.polygonZkEvm.id]: "polygon-zkevm",
  [chains.polygonZkEvmTestnet.id]: "1442",
  [chains.base.id]: "base",
  [chains.baseGoerli.id]: "84531",
  [chains.baseSepolia.id]: "base-sepolia",
};

// TODO: MODIFY BELOW - List above is for alchemy, need to change to hypersync

export const getEnvioRpcUrl = (chainId: number) => {
  return RPC_CHAIN_NAMES[chainId]
    ? `https://${RPC_CHAIN_NAMES[chainId]}.rpc.hypersync.xyz/${appConfig.hypersyncBearerToken}`
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
