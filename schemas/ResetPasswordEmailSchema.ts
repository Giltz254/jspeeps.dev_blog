import { z } from 'zod';

export const PasswordEmailSchema = z.object({
  email: z.string()
    .min(1, { message: "Please provide a valid email!" })
    .email({ message: "Please provide a valid email!" }),
});

export type PasswordEmailSchemaType = z.infer<typeof PasswordEmailSchema>;
