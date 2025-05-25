"use server";
import {
  generatePasswordResetToken,
  sendPasswordResetToken,
} from "@/lib/PasswordResetToken";
import { getUserByEmail } from "@/lib/user";
import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/ResetPasswordEmailSchema";

export const passwordResetEmail = async (values: PasswordEmailSchemaType) => {
  const validatedFields = PasswordEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }
  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);
  if (!user || !user.email) {
    return { error: "User doesn't exist!" };
  }
  if (user.email && user.provider !== "credentials") {
    return { error: `please proceed with ${user.provider}` };
  }
  const passwordResetToken = await generatePasswordResetToken(email);
  const { error } = await sendPasswordResetToken(
    passwordResetToken.email,
    passwordResetToken.token,
    user.name as string
  );
  if (error) {
    return { error: "Something went wrong! Please try again."}
  }
  return { success: "Password reset link sent! Check your email."}
};
