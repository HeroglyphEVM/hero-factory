import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { KeyData } from "@/types/key-types"
import { KeysTable } from "./KeysTable/KeysTable";

export const RecentMintsCard = ({ keyData }: { keyData: KeyData }) => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Mints</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <KeysTable keyData={keyData} />
        </div>
      </CardContent>
    </Card>
  )
}