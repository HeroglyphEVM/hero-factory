import { BlockNounAvatar } from "@/components/profile/BlockieAvatar"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { TokenData, TokenTransfer } from "@/types/token-types"
import { truncateTxHash } from "@/utils/web3"
import { AlertCircle, ArrowRight, Factory } from "lucide-react"

export const TransfersTable = ({ tokenData, transfers }: { tokenData: TokenData, transfers: TokenTransfer[] }) => {

  if (transfers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p>There are no transfers for this token.</p>
      </div>

    );
  }

  return (
    <div className="space-y-4">
      <div className="sm:hidden space-y-2">
        {transfers?.map((tx, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 text-sm border-b py-2 last:border-b-0 items-center">
            <div className="text-center text-muted-foreground ml-4">
              {tx.from === "0x0000000000000000000000000000000000000000" ? (
                      <Factory className="text-yellow-500" /> 
                    ) : (
                      <>
                        <BlockNounAvatar address={tx.from} size={9} />
                        <CopyButton value={tx.from} />
                      </>
                    )}
            </div>
            <div className="flex justify-center items-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center text-muted-foreground">
              <BlockNounAvatar address={tx.to} size={9} />
            </div>
            <div className="text-right col-span-2 text-muted-foreground">
              {Number(tx.value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0
                    })} {tokenData.symbol}</div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-2">Transaction Hash</th>
              <th className="pb-2">From</th>
              <th className="pb-2">To</th>
              <th className="pb-2">Block Number</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transfers?.map((tx, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">
                  <Button variant="link" className="p-0 text-left">
                    <span className="font-medium">{truncateTxHash(tx.txHash)}</span>
                  </Button>
                  <CopyButton value={tx.txHash} />
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    {tx.from === "0x0000000000000000000000000000000000000000" ? (
                      <Factory className="text-yellow-500" /> 
                    ) : (
                      <>
                        <BlockNounAvatar address={tx.from} size={9} />
                        <CopyButton value={tx.from} />
                      </>
                    )}
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    {tx.to === "0x0000000000000000000000000000000000000000" ? (
                      <Factory className="text-yellow-500" />  
                    ) : (
                      <>
                        <BlockNounAvatar address={tx.to} size={9} />
                        <CopyButton value={tx.to} />
                      </>
                    )}
                  </div>
                </td>
                <td className="py-2 text-sm text-muted-foreground">{tx.blockNumber}</td>
                <td className="py-2 text-right">
                  <span className="font-medium text-muted-foreground">
                    {Number(tx.value).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0
                    })} {tokenData.symbol}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}