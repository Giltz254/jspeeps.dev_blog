"use client"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import queryString from 'query-string'
const Pagination = ({currentPage, hasMore}: { currentPage: number, hasMore: boolean}) => {
    const params = useSearchParams()
    const currentQuery = queryString.parse(params.toString())
    const searchParams = queryString.stringifyUrl({url: '', query: currentQuery})
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
        {currentPage > 1 && (
          <Link href={`/blog/feed/${currentPage - 1}${searchParams}`}>
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
              ← Previous
            </span>
          </Link>
        )}
        {hasMore && <span className="text-sm text-gray-700">Page {currentPage}</span>}
        {hasMore && (
          <Link href={`/blog/feed/${currentPage + 1}${searchParams}`}>
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Next →
            </span>
          </Link>
        )}
      </div>
  )
}

export default Pagination