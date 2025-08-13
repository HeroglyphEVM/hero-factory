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
    return createClient({
      chain,
      transport: http(getEnvioRpcUrl(chain.id)),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: appConfig.pollingInterval,
          }
        : {}),
    });
  },
});
