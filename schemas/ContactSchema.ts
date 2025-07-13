import { z } from "zod";
export const ContactSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  categories: z.array(z.string()).optional(),
  topic: z
    .string()
    .min(10, { message: "Topic must be at least 10 characters" })
    .max(500, { message: "Topic must be at most 500 characters" }),
});
export type ContactSchemaType = z.infer<typeof ContactSchema>;
