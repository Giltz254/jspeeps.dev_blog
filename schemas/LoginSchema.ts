import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string()
    .min(1, { message: "Please provide a valid email!" })
    .email({ message: "Please provide a valid email!" }),
  password: z.string().min(6, { message: "Password should be at least 6 characters long!" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
