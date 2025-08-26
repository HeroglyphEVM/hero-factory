import { hardhat } from 'viem/chains';
import { Chain, createClient, http } from 'viem';
import { wagmiConnectors } from './wagmiConnectors';
import { createConfig } from 'wagmi';
import { getRpcHttpUrl } from '@/utils/web3/networks';
import appConfig from '@/app.config';
import * as chains from 'viem/chains';

export const IS_ENV_DEV = process.env.NODE_ENV == 'development';

if (IS_ENV_DEV) {
  console.log('App environment is in development mode!');
}

export enum EAppNetworks {
  ARBITRUM = 42161,
  BASE_SEPOLIA = 84532,
}

export const NETWORK_TO_CHAIN: Record<EAppNetworks, chains.Chain> = {
  [EAppNetworks.ARBITRUM]: chains.arbitrum,
  [EAppNetworks.BASE_SEPOLIA]: chains.baseSepolia,
};

export const DEFAULT_CHAIN = IS_ENV_DEV ? EAppNetworks.BASE_SEPOLIA : EAppNetworks.ARBITRUM;

export const TARGET_NETWORK = IS_ENV_DEV ? chains.baseSepolia : chains.arbitrum;

export const wagmiConfig = createConfig({
  chains: [TARGET_NETWORK],
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    // Return example: https://base-sepolia.rpc.hypersync.xyz/<token>
    const url = getRpcHttpUrl(chain.id);

    if (!url) {
      throw new Error(`No RPC URL found for chain ${chain.id}`);
    }

    return createClient({
      chain,
      transport: http(url),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: appConfig.pollingInterval,
          }
        : {}),
    });
  },
});
