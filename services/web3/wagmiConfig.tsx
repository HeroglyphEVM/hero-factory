import { hardhat } from "viem/chains";
import { Chain, createClient, http } from "viem";
import { wagmiConnectors } from "./wagmiConnectors";
import { createConfig } from "wagmi";
import { getEnvioRpcUrl } from "@/utils/web3/networks";
import appConfig from "@/app.config";

export const wagmiConfig = createConfig({
  chains: [appConfig.targetNetwork],
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    // Return example: https://base-sepolia.rpc.hypersync.xyz/<token>
    const url = getEnvioRpcUrl(chain.id);

    if (!url) {
      throw new Error(`No RPC URL found for chain ${chain.id}`);
    }

    // TODO: MODIFY BELOW - Right now I will be using the base sepolia rpc url but I need to change this later to use the hypersync rpc url if I can make it work.

    return createClient({
      chain,
      transport: http("https://sepolia.base.org"),
      // transport: http(url),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: appConfig.pollingInterval,
          }
        : {}),
    });
  },
});
