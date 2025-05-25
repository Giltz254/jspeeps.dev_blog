import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(4, { message: "Name should be atleast 4 characters long!"}),
  email: z
    .string()
    .min(1, { message: "Please provide a valid email!" })
    .email({ message: "Please provide a valid email!" }),
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

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
