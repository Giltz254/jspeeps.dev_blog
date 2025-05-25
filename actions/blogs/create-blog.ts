"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { generateUniqueSlug } from "@/lib/utils";
import { BlogSchema, BlogSchemaType } from "@/schemas/BlogShema";

export const createBlog = async (
  values: BlogSchemaType & { slug?: string }
) => {
  const { isPublished, title, userId, slug: providedSlug } = values;

  const user = await getUserById(userId);
  if (!user) return { error: "User does not exist!" };

  let slug = providedSlug || "";
  let existingBlog = null;
  if (providedSlug) {
    existingBlog = await db.blog.findUnique({ where: { slug: providedSlug } });
    if (!existingBlog) {
      return { error: "Blog not found!" };
    }
    if (title !== existingBlog.title) {
      const newSlug = await generateUniqueSlug(title);
      if (!newSlug) return { error: "Could not generate a unique slug. Please try a different title." };
      slug = newSlug;
    } else {
      slug = existingBlog.slug;
    }
    try {
      const updatedBlog = await db.blog.update({
        where: { id: existingBlog.id },
        data: {
          ...values,
          slug,
          content: values.content || " ",
        },
      });

      return {
        success: isPublished ? "Blog Updated!" : "Blog Saved as Draft!",
        blog: updatedBlog,
      };
    } catch (err) {
      return { error: "Failed to update the blog." };
    }
  }
  const newSlug = await generateUniqueSlug(title);
  if (!newSlug) return { error: "Could not generate a unique slug. Please try a different title." };
  slug = newSlug;

  if (!isPublished && (!title || title.trim() === "")) {
    return { error: "Title is required to save a draft." };
  }
  if (isPublished) {
    const validatedFields = await BlogSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields!" };
    if (!user.emailVerified) return { error: "Not authorized! Verify your email to continue." };
  }

  try {
    const createdBlog = await db.blog.create({
      data: {
        ...values,
        slug,
        content: values.content || " ",
      },
    });

    return {
      success: isPublished ? "Blog Published!" : "Blog Draft Saved!",
      blog: createdBlog,
    };
  } catch (err) {
    return { error: "Something went wrong! Please try again." };
  }
};
