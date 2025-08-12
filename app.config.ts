import * as chains from "viem/chains";

export type AppConfig = {
  targetNetwork: chains.Chain;
  // targetNetworks: readonly chains.Chain[];
  chains: chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
};

const appConfig = {
  // The network where your DApp lives in
  targetNetwork: chains.baseSepolia,
  // targetNetwork: chains.mainnet,

  // The networks where your DApp can be connected to
  chains: [chains.baseSepolia, chains.mainnet],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect on the local network
  pollingInterval: 10000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey:
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ||
    "rEjtgJdffu-YuX-yux6nhRYH5NFrllnO",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
    "e4c944d25e0008d53a376056bef70c8d",
} satisfies AppConfig;

export default appConfig;
