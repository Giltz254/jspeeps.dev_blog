"use server";
import bcryptjs from "bcryptjs";

import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/EmailVerification";

export const SignUp = async (values: RegisterSchemaType) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { name, email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  const emailName = email.split("@")[0];
  let baseUsername = emailName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseUsername;
  if (existingUser) {
    return { error: "Already a member! Please log in to continue." };
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        provider: "credentials"
      },
    });
    const emailVerificationToken = await generateEmailVerificationToken(email);
    const { error } = await sendEmailVerificationToken(
      emailVerificationToken.email,
      emailVerificationToken.token,
      name
    );
    if (error) {
        return { error: "Something went wrong while sending verification email! Try to login to resend the verification email." }
    }
    return { success: "Verification email sent!" };
  } catch (error) {
    return { error: "Something went wrong! Please try again." };
  }
};
