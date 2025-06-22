import Link from 'next/link'
import React from 'react'

const Pagination = ({
  currentPage,
  hasMore,
  tag,
  username
}: {
  currentPage: number
  hasMore: boolean
  tag?: string
  username?: string;
}) => {
  const getHref = (page: number) => {
    if (tag) return `/tags/${tag}?page=${page}`
    if (username) {
      return `/user/${username}?page=${page}`
    }
    return `/blog/feed/${page}`
  }

  return (
    <div className="flex items-center justify-center gap-6 mt-8 font-[family-name:var(--font-lora)]">
      {currentPage > 1 && (
        <Link href={getHref(currentPage - 1)}>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
            ← Previous
          </span>
        </Link>
      )}
      {hasMore && <span className="text-sm text-gray-700">Page {currentPage}</span>}
      {hasMore && (
        <Link href={getHref(currentPage + 1)}>
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
            Next →
          </span>
        </Link>
      )}
    </div>
  )
}

export default Pagination
