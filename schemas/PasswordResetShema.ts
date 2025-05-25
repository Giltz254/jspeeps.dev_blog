import { z } from "zod";

export const PasswordResetShema = z.object({
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long!" }),
    confirmPassword: z.string()
}).refine(
    (values) => {
        return values.password === values.confirmPassword
    },
    {
        message: "Passwords don't match!",
        path: ["confirmPassword"]
    }
)

export type PasswordResetShemaType = z.infer<typeof PasswordResetShema>;
