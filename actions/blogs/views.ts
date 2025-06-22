"use server"
import { db } from "@/lib/db"
export const updateViews = async ({ slug }: { slug: string }) => {
  const blog = await db.blog.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (!blog) {
    return { success: false }
  }
  try {
    await db.view.upsert({
      where: { blogId: blog.id },
      update: { count: { increment: 1 } },
      create: { blogId: blog.id, count: 1 },
    })

    return { success: true }
  } catch {
    return { success: false }
  }
}
