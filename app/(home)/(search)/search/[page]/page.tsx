import ArticleCard from "@/components/custom/blog/ArtcleCard";
import Search from "@/components/custom/navbar/Search";
import { fetchSearchResults } from "@/lib/fetchSearchResults";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ page: string }>;
const SearchPage = async ({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) => {
  const { query } = await searchParams;
  const searchQuery =
    typeof query === "string"
      ? query.trim()
      : Array.isArray(query)
        ? (query[0]?.trim() ?? "")
        : "";
  const { page } = await params;
  const limit = 10;
  const currentPage = parseInt(page, 10) || 1;
  const result = await fetchSearchResults({
    query: searchQuery,
    page: currentPage,
    limit,
  });
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="sticky top-16 bg-white z-10 w-full h-16 border-b flex items-center justify-center sm:hidden px-4">
        <Search isNavbar={false} />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Results for:</h2>
          <div className="px-4 py-3 bg-gray-100 rounded-xl border text-sm text-gray-600">
            {searchQuery ? searchQuery : "Your recent search will appear here"}
          </div>
          {result.status === "success" && (
            <div className="text-sm text-gray-500">
              {result.totalCount} result{result.totalCount === 1 ? "" : "s"}{" "}
              found
            </div>
          )}
        </aside>
        <section className="min-h-[200px] grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.status === "error" && (
            <p className="col-span-full border rounded-xl flex items-center justify-center font-normal text-base text-red-600">
              {result.message}
            </p>
          )}

          {result.status === "rate-limited" && (
            <p className="col-span-full border rounded-xl flex items-center justify-center font-normal text-base text-orange-600">
              You’re sending requests too quickly. Please wait and try again.
            </p>
          )}

          {result.status === "bot-denied" && (
            <p className="col-span-full border rounded-xl flex items-center justify-center font-normal text-base text-purple-600">
              Access denied. Bots are not allowed to use search.
            </p>
          )}

          {result.status === "invalid-data" && (
            <p className="col-span-full border rounded-xl flex items-center justify-center font-normal text-base text-yellow-600">
              Unexpected response from server.
            </p>
          )}

          {result.status === "no-results" && (
            <p className="col-span-full border rounded-xl flex items-center justify-center font-normal text-base text-pink-500">
              No results found.
            </p>
          )}

          {result.status === "success" &&
            result.blogs.map((result) => (
              <div key={result.id} className="w-full border">
                <ArticleCard blog={result} />
              </div>
            ))}
        </section>
      </div>
    </div>
  );
};
export default SearchPage;
