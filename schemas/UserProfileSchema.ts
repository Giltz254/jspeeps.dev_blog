import { z } from 'zod';
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  bio: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
      message: "Enter a valid URL",
    }),
  twitter: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
      message: "Enter a valid Twitter URL",
    }),
});