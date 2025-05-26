"use server";

import { signIn } from "@/auth";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/EmailVerification";
import { getUserByEmail } from "@/lib/user";
import { LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { AuthError } from "next-auth";

export const Login = async (values: LoginSchemaType, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !email || !password || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }
  if (!existingUser.emailVerified) {
    if (!existingUser.email || !existingUser.name) {
      return { error: "Missing user email or name for verification." };
    }
    const emailVerificationToken = await generateEmailVerificationToken(
      existingUser.email
    );
    const { error } = await sendEmailVerificationToken(
      emailVerificationToken.email,
      emailVerificationToken.token,
      existingUser.name
    );
    if (error) {
      return {
        error:
          "Something went wrong while sending verification email! Try to login to resend the verification email.",
      };
    }
    return { success: "Verification email sent! Please verify your email to continue", requiresVerification: true };
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong! Please try again." };
      }
    }
  }
};
