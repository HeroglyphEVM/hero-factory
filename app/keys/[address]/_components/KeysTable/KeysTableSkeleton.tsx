import { Skeleton } from "@/components/ui/skeleton";

export const KeysTableSkeleton = () => {
  const skeletonItems = Array(12).fill(null);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-6">
      {skeletonItems.map((_, index) => (
        <div key={index} className="flex flex-col items-center p-2 rounded-lg">
          <Skeleton className="w-24 h-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}