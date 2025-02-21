import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="flex flex-col space-y-6 p-4 w-full">
      <Skeleton className="h-[125px] w-full rounded-xl shadow-lg" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      <Skeleton className="h-[125px] w-full rounded-xl shadow-lg" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      <Skeleton className="h-[125px] w-full rounded-xl shadow-lg" />
    </div>
  );
}
