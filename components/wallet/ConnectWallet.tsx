import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import { WalletIcon } from "lucide-react";
import { BlockNounAvatar } from "@/components/profile/BlockieAvatar"; // Import BlockNounAvatar

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      const ready = mounted && authenticationStatus !== 'loading';
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus ||
          authenticationStatus === 'authenticated');

      return (
        <div
          {...(!ready && {
            'aria-hidden': true,
            'style': {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!connected) {
              return (
                <Button onClick={openConnectModal} variant="outline" className="flex">
                  <WalletIcon className="mr-2 h-4 w-4" />Connect
                </Button>
              );
            }

            if (chain.unsupported) {
              return (
                <Button onClick={openChainModal}>
                  Wrong network
                </Button>
              );
            }

            return (
                <div className="flex items-center gap-2">
                  <div className="flex ">
                    <Button variant="outline" onClick={openAccountModal}>
                      <div className="mr-2 -ml-3"> {/* Added margin for spacing */}
                        <BlockNounAvatar address={account.address} size={9} />
                      </div>
                      {account.displayName}
                    </Button>
                  </div>
                </div>
            );
          })()}
        </div>
      );
    }}
  </ConnectButton.Custom>
  )
}