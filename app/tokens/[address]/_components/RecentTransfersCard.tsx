import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useGetRecentTransfers } from "@/hooks/tokens/useGetRecentTransfers"
import { TokenData } from "@/types/token-types"
import { Address } from "viem"
import { TableSkeleton } from "./TransfersTable/TransfersTableSkeleton"
import { TransfersTable } from "./TransfersTable/TransfersTable"

export const RecentTransfersCard = ({ tokenData }: { tokenData: TokenData }) => {
  const { data: recentTransfers, isLoading } = useGetRecentTransfers(tokenData.address as Address)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <TransfersTable tokenData={tokenData} transfers={recentTransfers ?? []} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}