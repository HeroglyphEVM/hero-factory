import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { KeyData } from "@/types/key-types"
import { Address } from "viem"
import { TableSkeleton } from "./TransfersTable/TransfersTableSkeleton"
import { TransfersTable } from "./TransfersTable/TransfersTable"
import { useGetRecentKeyTransfers } from "@/hooks/keys/useGetRecentKeyTransfers"

export const RecentKeyTransfersCard = ({ keyData }: { keyData: KeyData }) => {
  const { data: recentTransfers, isLoading } = useGetRecentKeyTransfers(keyData.address as Address)

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <TransfersTable transfers={recentTransfers ?? []} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}