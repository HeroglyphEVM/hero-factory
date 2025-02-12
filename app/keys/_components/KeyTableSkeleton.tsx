import { Skeleton } from "@/components/ui/skeleton";

export const KeyTableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
)