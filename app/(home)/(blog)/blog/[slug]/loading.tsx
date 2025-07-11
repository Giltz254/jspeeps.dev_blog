import { Skeleton } from "@/components/ui/skeleton";
const BlogLoading = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 animate-pulse">
      <Skeleton className="h-10 md:h-12 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-6" />
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="w-full h-72 sm:h-96 relative overflow-hidden mb-10">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <Skeleton className="h-20 w-full rounded-md mb-10" />
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <div className="mt-12 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-md" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default BlogLoading;
