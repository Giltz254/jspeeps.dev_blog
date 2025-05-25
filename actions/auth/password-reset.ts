"use server";
import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/PasswordResetToken";
import { getUserByEmail } from "@/lib/user";
import { PasswordResetShemaType, PasswordResetShema } from "@/schemas/PasswordResetShema";
import bcrypt from "bcryptjs";

export const PasswordReset = async (values: PasswordResetShemaType, token?: string | null) => {
    if (!token) {
        return { error: "Token does not exist!"}
    }
  const validatedFields = PasswordResetShema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid password!" };
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!"}
  }
  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    return { error: "Token expired! Please retry again."}
  }
  const user = await getUserByEmail(existingToken.email)
  if (!user) {
    return { error: "User does not exist!"}
  }
  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.user.update({
        where: {
            email: existingToken.email
        },
        data: {
            password: hashedPassword
        }
    })
    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })
    return { success: "Password Changed!"}
  } catch (error) {
    return { error: "Something went wrong! Please try again."}
  }
};
