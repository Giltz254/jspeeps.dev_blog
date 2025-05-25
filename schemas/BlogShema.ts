import { z } from "zod";
export const BlogSchema = z.object({
  userId: z.string(),
  title: z
    .string()
    .min(18, { message: "Title is too short" })
    .max(150, { message: "Title can't exceed 150 charaters!" }),
  description: z
    .string()
    .min(50, { message: "Blog description is too short!" })
    .max(160, { message: "maximum limit for blog description exceeded!" }),
  content: z.array(z.any()).min(1, { message: "Content is too short!" }),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
});
export type BlogSchemaType = z.infer<typeof BlogSchema>