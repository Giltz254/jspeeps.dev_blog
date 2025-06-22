'use client'

import { updateViews } from '@/actions/blogs/views'
import { useEffect } from 'react'
export function ViewsUpdater({ slug }: { slug: string }) {
  useEffect(() => {
    updateViews({ slug })
      .catch(() => {
      })
  }, [slug])
  return null
}
