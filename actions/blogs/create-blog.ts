"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { generateUniqueSlug } from "@/lib/utils";
import { BlogSchema, BlogSchemaType } from "@/schemas/BlogShema";
import { revalidateTag } from "next/cache";

export const createBlog = async (values: BlogSchemaType & { id?: string }) => {
  const { isPublished, title, userId, id: providedId } = values;

  const user = await getUserById(userId);
  if (!user) return { error: "User does not exist!" };
  const searchText = `${values.title || ""} ${values.description || ""} ${values.summary || ""}`
    .toLowerCase()
    .replace(/\s+/g, "");
  let slug = "";
  let existingBlog = null;

  if (providedId) {
    existingBlog = await db.blog.findUnique({ where: { id: providedId } });

    if (!existingBlog) {
      return { error: "Blog not found!" };
    }
    if (title !== existingBlog.title) {
      const newSlug = await generateUniqueSlug(title);
      if (!newSlug)
        return {
          error:
            "Could not generate a unique slug. Please try a different title.",
        };
      slug = newSlug;
    } else {
      slug = existingBlog.slug;
    }

    try {
      const updatedBlog = await db.blog.update({
        where: { id: existingBlog.id },
        data: {
          slug,
          content: values.content || " ",
          title: values.title,
          description: values.description,
          isPublished: values.isPublished,
          tags: values.tags?.map((tag) => tag.toLowerCase()) || [],
          coverImage: values.coverImage,
          summary: values.summary,
          readtime: values.readtime,
          searchText,
          user: {
            connect: { id: userId },
          },
        },
      });
      revalidateTag("blogs");
      return {
        success: isPublished ? "Blog Updated!" : "Blog Saved as Draft!",
        blog: updatedBlog,
      };
    } catch (err) {
      return { error: "Failed to update the blog." };
    }
  }
  const newSlug = await generateUniqueSlug(title);
  if (!newSlug)
    return {
      error: "Could not generate a unique slug. Please try a different title.",
    };
  slug = newSlug;

  if (!isPublished && (!title || title.trim() === "")) {
    return { error: "Title is required to save a draft." };
  }

  if (isPublished) {
    const validatedFields = await BlogSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields!" };
    if (!user.emailVerified)
      return { error: "Not authorized! Verify your email to continue." };
  }

  try {
    const createdBlog = await db.blog.create({
      data: {
        ...values,
        tags: values.tags?.map((tag) => tag.toLowerCase()) || [],
        slug,
        summary: values.summary,
        content: values.content || " ",
        readtime: values.readtime,
        searchText,
      },
    });
    revalidateTag("blogs");
    return {
      success: isPublished ? "Blog Published!" : "Blog Draft Saved!",
      blog: createdBlog,
    };
  } catch (err) {
    return { error: "Something went wrong! Please try again." };
  }
};
