import appConfig from "@/app.config";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const wallets = [
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  rainbowWallet,
  safeWallet
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],

  {
    appName: "hero-factory",
    projectId: appConfig.walletConnectProjectId,
  },
);