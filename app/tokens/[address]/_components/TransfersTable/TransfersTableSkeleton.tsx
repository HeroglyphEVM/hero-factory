import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = () => (
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
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-t">
          <td className="py-2"><Skeleton className="h-6 w-24" /></td>
          <td className="py-2"><Skeleton className="h-6 w-6 rounded-full" /></td>
          <td className="py-2"><Skeleton className="h-6 w-6 rounded-full" /></td>
          <td className="py-2"><Skeleton className="h-6 w-16" /></td>
          <td className="py-2 text-right">
            <Skeleton className="h-6 w-20 ml-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)