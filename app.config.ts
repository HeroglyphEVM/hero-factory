import * as chains from 'viem/chains';

export type AppConfig = {
  // targetNetwork: chains.Chain;
  // targetNetworks: readonly chains.Chain[];
  chains: chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  hypersyncBearerToken?: string;
};

const appConfig: AppConfig = {
  // The network where your DApp lives in
  // targetNetwork: chains.arbitrum,

  // The networks where your DApp can be connected to
  chains: [chains.arbitrum, chains.baseSepolia],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect on the local network
  pollingInterval: 10000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.

  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'rEjtgJdffu-YuX-yux6nhRYH5NFrllnO',

  hypersyncBearerToken: process.env.NEXT_PUBLIC_HYPERSYNC_BEARER_TOKEN || '',

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.

  // ! This does not exist in the .env.local file, so I may need to generate a new one.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'e4c944d25e0008d53a376056bef70c8d',
};

export default appConfig;
